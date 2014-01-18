install:
	@pip install -r requirements.txt
	@python setup.py install

dev:
	@pip install -r test-requirements.txt
	@python setup.py develop

clean:
	@rm -rf htmlcov *.egg *.egg-info .coverage docs/_build

test:
	@py.test shapeways/tests

test-cov:
	@py.test --cov shapeways --cov-report html shapeways/tests

test-coveralls:
	@py.test --cov shapeways --cov-report term-missing shapeways/tests
	@coveralls

docs:
	@pip install -r docs-requirements.txt
	@cd ./docs; make html

.PHONY: install dev clean test test-cov test-coveralls docs
