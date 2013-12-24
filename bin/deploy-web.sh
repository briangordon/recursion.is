set -e
cd $(dirname $(readlink -f $0))
cd ..

# Optimize and minify the static web content and deploy it onto S3

java -classpath bin/requirejs/mozilla-rhino.jar:bin/requirejs/google-closure-compiler.jar \
     org.mozilla.javascript.tools.shell.Main bin/requirejs/r.js -o web/build.js

aws s3 --endpoint-url=http://s3.amazonaws.com sync --acl=public-read --delete \
    web-deploy s3://recursion.is