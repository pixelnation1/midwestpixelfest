plugins {
    id("com.android.application") version "8.9.2"
    id("org.jetbrains.kotlin.android") version "2.1.20"
    id("org.jetbrains.kotlin.plugin.compose") version "2.1.20"
}
android {
    namespace = "com.midwestpixelfest.guide"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.midwestpixelfest.guide"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }
    buildFeatures { compose = true }
}
dependencies {
    implementation("androidx.activity:activity-compose:1.10.1")
    implementation(platform("androidx.compose:compose-bom:2025.04.01"))
    implementation("androidx.compose.material3:material3")
}
