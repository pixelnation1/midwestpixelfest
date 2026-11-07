-- Midwest PixelFest 2027 persistent QA regression (rollback only).
-- Run in an admin SQL console against a non-production database when possible.
-- This file never commits a test event, registration or match.
BEGIN;
DO $tests$
DECLARE
  tid uuid;
  ids uuid[];
  reg_status text;
  promoted text;
  first_match uuid;
  second_match uuid;
  final_match uuid;
  first_seed uuid;
BEGIN
  INSERT INTO public.tournament_events
    (slug,title,game_title,category,format,entry_type,team_size,
     capacity,event_date,start_time,status,is_published,registration_open)
  VALUES
    ('qa-rollback-' || substr(replace(gen_random_uuid()::text,'-',''),1,15),
     'QA Transaction Test','QA Test Game','video_games','single_elimination',
     'individual',1,4,'2027-10-16','13:00','draft',false,false)
  RETURNING id INTO tid;

  -- Drafts must not accept registration.
  BEGIN
    PERFORM public.register_tournament_entry(tid,'QA-BLOCKED',gen_random_uuid(),
      'QA Adult','blocked@example.invalid','Blocked','','adult',false,false);
    RAISE EXCEPTION 'FAIL: private draft accepted registration';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%registration_closed%' THEN RAISE; END IF;
  END;

  UPDATE public.tournament_events SET
    status='confirmed',is_published=true,registration_open=true
  WHERE id=tid;

  -- Four registrations, then a waitlist entry.
  FOR i IN 1..5 LOOP
    SELECT result_status INTO reg_status FROM public.register_tournament_entry(
      tid,'QA-'||i,gen_random_uuid(),'QA Adult','qa'||i||'@example.invalid',
      'QA Competitor '||i,'','adult',false,false);
    IF i<=4 AND reg_status <> 'registered' THEN
      RAISE EXCEPTION 'FAIL: expected registered for %',i;
    END IF;
    IF i=5 AND reg_status <> 'waitlisted' THEN
      RAISE EXCEPTION 'FAIL: expected waitlist for fifth competitor';
    END IF;
  END LOOP;

  SELECT array_agg(id ORDER BY reference) INTO ids
    FROM public.tournament_registrations WHERE tournament_id=tid;

  -- Withdrawal should promote the next waitlisted entrant.
  SELECT promoted_reference INTO promoted FROM public.manage_tournament_entry(ids[2],'withdrawn');
  IF promoted <> 'QA-5' THEN RAISE EXCEPTION 'FAIL: waitlist promotion'; END IF;

  -- Check-in then bracket seed.
  PERFORM public.manage_tournament_entry(ids[1],'checked_in');
  PERFORM public.manage_tournament_entry(ids[3],'checked_in');
  PERFORM public.manage_tournament_entry(ids[4],'checked_in');
  PERFORM public.manage_tournament_entry(ids[5],'checked_in');

  PERFORM public.seed_tournament_matches(tid,jsonb_build_array(
    jsonb_build_object('bracket_side','winners','round_number',1,'match_number',1,
      'player_a',ids[1],'player_b',ids[5],'winner_id',null,'status','pending'),
    jsonb_build_object('bracket_side','winners','round_number',1,'match_number',2,
      'player_a',ids[3],'player_b',ids[4],'winner_id',null,'status','pending'),
    jsonb_build_object('bracket_side','winners','round_number',2,'match_number',1,
      'player_a',null,'player_b',null,'winner_id',null,'status','pending')
  ));
  IF (SELECT registration_open FROM public.tournament_events WHERE id=tid) THEN
    RAISE EXCEPTION 'FAIL: bracket did not close signup';
  END IF;

  SELECT id INTO first_match FROM public.tournament_matches
    WHERE tournament_id=tid AND round_number=1 AND match_number=1;
  SELECT id INTO second_match FROM public.tournament_matches
    WHERE tournament_id=tid AND round_number=1 AND match_number=2;
  SELECT id INTO final_match FROM public.tournament_matches
    WHERE tournament_id=tid AND round_number=2;

  PERFORM public.complete_tournament_match(first_match,ids[1],2,0);
  PERFORM public.complete_tournament_match(second_match,ids[3],2,1);
  IF (SELECT player_a FROM public.tournament_matches WHERE id=final_match) <> ids[1] THEN
    RAISE EXCEPTION 'FAIL: winner advancement';
  END IF;
  PERFORM public.complete_tournament_match(final_match,ids[1],3,1);
  IF (SELECT winner_id FROM public.tournament_matches WHERE id=final_match) <> ids[1] THEN
    RAISE EXCEPTION 'FAIL: final winner';
  END IF;

  RAISE NOTICE 'PASS: draft closure, capacity, waitlist, check-in, bracket, result and winner progression';
END;
$tests$;
ROLLBACK;
