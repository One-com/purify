.PHONY: all test

all: test

test:
	./node_modules/.bin/mocha -R spec

.PHONY: git-hook
git-hook:
	echo make git-pre-commit > .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit

.PHONY: git-pre-commit
git-pre-commit: test
