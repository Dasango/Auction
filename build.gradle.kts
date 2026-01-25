plugins {
    id("java")
    id("io.freefair.lombok") version "9.1.0"
}

group = "com.uce"
version = "unspecified"

repositories {
    mavenCentral()
}

dependencies {

    implementation("org.jboss.weld.se:weld-se-core:6.0.3.Final")
    implementation("io.smallrye:jandex:3.5.1")

    implementation("io.helidon.dbclient:helidon-dbclient:4.3.2")
    implementation("io.helidon.dbclient:helidon-dbclient-jdbc:4.3.2")
    implementation("io.helidon.dbclient:helidon-dbclient-hikari:4.3.2")
    implementation("io.helidon.config:helidon-config-yaml:4.3.2")

    implementation("org.hibernate:hibernate-core:7.1.10.Final")

    implementation("org.postgresql:postgresql:42.7.8")
}

sourceSets {
    main {
        output.setResourcesDir( file("${buildDir}/classes/java/main") )
    }
}
