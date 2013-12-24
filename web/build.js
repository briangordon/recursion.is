({
    "appDir": "./",
    "dir": "../web-deploy/",
    "baseUrl": "js/",
    "mainConfigFile": "js/main.js",

    "optimize": "closure",

    "modules": [
        {
            "name": "main"
        }
    ],

    "closure": {
        "CompilerOptions": {
            "languageIn": Packages.com.google.javascript.jscomp.CompilerOptions.LanguageMode.ECMASCRIPT5
        }
    }
})