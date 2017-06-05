# Screeps
My screeps AI. It's not very good and doesn't do very much yet.
This is mostly a way for me to mess around with typescript whilst also having fun.

## Building

Using a linux distribution with Java installed simply run `./gradlew build` to compile the typescript into
a single file format used with Screeps.

## Deploying

You can deploy the code straight to screeps by creating a `gradle.properties` file in the format of `gradle.properties.example`.
If you signed up to Screeps using GitHub or Steam you will need to attach both an email and password to the account.

Once done, simply use `./gradlew deploy` and your code will be deployed 
(currently to a branch called "dev" - this must already exist in game)
