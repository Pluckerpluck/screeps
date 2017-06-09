# Screeps
My screeps AI. It's not very good and doesn't do very much yet.
This is mostly a way for me to mess around with typescript whilst also having fun.

## Initialisation

Before you start making any changes you should run `./gradlew npmInstall`. 
This will download all dependencies required to build the typescript into javascript,
and will ensure that all @types are available for any IDE autocomplete or
tslint in use.

## Building

Simply run `./gradlew build` to compile the typescript into
a single file format used with Screeps.

This will automatically run the task `npmInstall` if it is required.

## Deploying

You can deploy the code straight to screeps by creating a `gradle.properties` file in the format of `gradle.properties.example`.
If you signed up to Screeps using GitHub or Steam you will need to attach both an email and password to the account.

Once done, simply use `./gradlew deploy` and your code will be deployed 
(currently to a branch called "dev" - this must already exist in game)

If you wish to deploy to a branch other than master you can either change the branch in gradle.properties or
use a command in the format `./gradlew deploy -Pbranch=development`.
