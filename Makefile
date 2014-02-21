BROWSERIFY_BIN = ./node_modules/.bin/browserify
WATCHIFY_BIN = ./node_modules/.bin/watchify

DIST = dist/vue-gestures.js
DIST_EXAMPLE = example/dist/example.js

all: dist example

clean:
	rm -rf ./dist
	rm -rf ./example/dist

dist: $(DIST)
example: $(DIST_EXAMPLE)

watch:
	mkdir -p example/dist
	$(WATCHIFY_BIN) example/index.js -o $(DIST_EXAMPLE)

$(DIST): index.js
	mkdir -p dist
	$(BROWSERIFY_BIN) --standalone vueGestures $^ -o $@

$(DIST_EXAMPLE): example/index.js
	mkdir -p example/dist
	$(BROWSERIFY_BIN) $^ -o $@

.PHONY: dist example watch all clean
