plugins {
    id("java")
    id("io.freefair.lombok") version "9.2.0"
}

group = "com.uce"
version = "unspecified"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")

    implementation("io.smallrye:jandex:3.1.6")

    implementation("org.jboss.weld.se:weld-se-core:6.0.0.Final")
    implementation("org.hibernate.orm:hibernate-core:7.1.0.Final")

    implementation("org.postgresql:postgresql:42.7.2")
}

tasks.test {
    useJUnitPlatform()
}

sourceSets {
    main {
        output.setResourcesDir(file("${buildDir}/classes/java/main"))
    }
}



