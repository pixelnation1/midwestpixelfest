package com.midwestpixelfest.guide

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

private const val SITE = "https://midwestpixelfest.com"
private data class Booth(val id: String, val name: String, val category: String, val description: String)

private fun decode(raw: String): List<Booth> {
    val rows = JSONArray(raw)
    return List(rows.length()) { index ->
        val row = rows.getJSONObject(index)
        Booth(row.getString("id"), row.getString("name"), row.optString("category"), row.optString("description"))
    }
}

private fun encode(rows: List<Booth>): String {
    val values = JSONArray()
    rows.forEach { booth ->
        values.put(JSONObject().put("id", booth.id).put("name", booth.name)
            .put("category", booth.category).put("description", booth.description))
    }
    return values.toString()
}

private fun fetchBooths(): List<Booth> {
    val request = URL("$SITE/api/mobile/exhibitors").openConnection() as HttpURLConnection
    return try {
        request.connectTimeout = 8000
        request.readTimeout = 8000
        if (request.responseCode != 200) throw IOException("Directory unavailable")
        request.inputStream.bufferedReader().use { decode(it.readText()) }
    } finally {
        request.disconnect()
    }
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme(
                primary = Color(0xffc5aeff), secondary = Color(0xff75dfdf),
                background = Color(0xff121123), surface = Color(0xff1d1a33)
            )) { Guide() }
        }
    }

    private fun openPage(path: String) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(SITE + path)))
        } catch (_: ActivityNotFoundException) {
            Toast.makeText(this, "Install a browser to open the festival website.", Toast.LENGTH_LONG).show()
        }
    }

    @Composable
    private fun Guide() {
        val prefs = remember { getSharedPreferences("attendee", MODE_PRIVATE) }
        fun restore(key: String) = runCatching { decode(prefs.getString(key, "[]") ?: "[]") }.getOrDefault(emptyList())
        var booths by remember { mutableStateOf(restore("directory")) }
        var saved by remember { mutableStateOf(restore("saved")) }
        var tab by rememberSaveable { mutableStateOf("Home") }
        var query by rememberSaveable { mutableStateOf("") }
        var refresh by remember { mutableIntStateOf(0) }
        var status by remember { mutableStateOf("Loading exhibitors…") }
        LaunchedEffect(refresh) {
            try {
                val latest = withContext(Dispatchers.IO) { fetchBooths() }
                booths = latest
                prefs.edit().putString("directory", encode(latest)).apply()
                status = if (latest.isEmpty()) "Exhibitors will appear here as they’re announced." else ""
            } catch (error: Exception) {
                if (error is kotlinx.coroutines.CancellationException) throw error
                status = if (booths.isEmpty()) "Directory unavailable. Try again or visit the website." else "Showing the last downloaded directory."
            }
        }
        Scaffold(bottomBar = {
            NavigationBar { listOf("Home", "Explore", "My Weekend").forEachIndexed { index, title ->
                NavigationBarItem(selected = tab == title, onClick = { tab = title },
                    icon = { Text(listOf("⌂", "⌕", "★")[index]) }, label = { Text(title) })
            } }
        }) { insets ->
            LazyColumn(Modifier.fillMaxSize().padding(insets), contentPadding = PaddingValues(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)) {
                item { Text(if (tab == "Home") "Midwest PixelFest" else tab, style = MaterialTheme.typography.headlineLarge) }
                if (tab == "Home") {
                    item { Text("October 16–17, 2027\nEmporia, Kansas", style = MaterialTheme.typography.titleLarge) }
                    item { Button(onClick = { openPage("/tickets") }, modifier = Modifier.fillMaxWidth()) { Text("Tickets & passes") } }
                    item { FilledTonalButton(onClick = { tab = "Explore" }) { Text("Explore exhibitors") } }
                    items(listOf("Schedule" to "/schedule", "Floor map" to "/floor-map", "Guest announcements" to "/guests")) { entry ->
                        OutlinedButton(onClick = { openPage(entry.second) }, modifier = Modifier.fillMaxWidth()) { Text(entry.first) }
                    }
                } else {
                    val directory = tab == "Explore"
                    if (directory) {
                        item { OutlinedTextField(query, { query = it }, label = { Text("Search exhibitors") }, singleLine = true, modifier = Modifier.fillMaxWidth()) }
                        if (status.isNotEmpty()) item { Text(status) }
                        item { Row { TextButton(onClick = { refresh++ }) { Text("Refresh") }
                            TextButton(onClick = { openPage("/exhibitors") }) { Text("Website directory") } } }
                    } else if (saved.isEmpty()) item {
                        Text("Save exhibitors from Explore to plan your weekend.")
                    }
                    val visible = if (directory) booths.filter { it.name.contains(query.trim(), true) || it.category.contains(query.trim(), true) }
                        else saved.map { favorite -> booths.firstOrNull { it.id == favorite.id } ?: favorite }
                    if (directory && booths.isNotEmpty() && visible.isEmpty()) item { Text("No matching exhibitors.") }
                    items(visible, key = { it.id }) { booth ->
                        val favorite = saved.any { it.id == booth.id }
                        Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(16.dp)) {
                            Text(booth.category, color = MaterialTheme.colorScheme.secondary)
                            Text(booth.name, style = MaterialTheme.typography.titleLarge)
                            Text(booth.description)
                            Row {
                                TextButton(onClick = { openPage("/exhibitors/" + Uri.encode(booth.id)) }) { Text("Profile") }
                                TextButton(onClick = {
                                    saved = if (favorite) saved.filterNot { it.id == booth.id } else saved + booth
                                    prefs.edit().putString("saved", encode(saved)).apply()
                                }) { Text(if (favorite) "Remove from weekend" else "Save to weekend") }
                            }
                        } }
                    }
                }
            }
        }
    }
}
