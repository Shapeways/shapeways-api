install:
	@npm install --production

dev:
	@npm install

clean:
	@rm -rf ./lib-cov coverage.html

test: dev
	@./node_modules/.bin/mocha -u tdd --check-leaks --recursive -R spec ./test

test-cov: dev lib-cov
	@COVERAGE=1 ./node_modules/.bin/mocha -u tdd --check-leaks --recursive -R html-cov ./test > coverage.html

test-coveralls: lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@COVERAGE=1 ./node_modules/.bin/mocha -u tdd --check-leaks --recursive -R mocha-lcov-reporter ./test | ./node_modules/.bin/coveralls

lib-cov:
	@./node_modules/.bin/jscoverage --no-highlight lib lib-cov

.PHONY: install dev clean test test-cov test-coveralls lib-cov
