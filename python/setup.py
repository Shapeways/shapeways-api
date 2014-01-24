#!/usr/bin/env python

from setuptools import setup, find_packages

from shapeways import __version__

setup(
    name="shapeways",
    version=__version__,
    author="Shapeways",
    author_email="api@shapeways.com",
    packages=find_packages(),
    install_requires=["oauthlib==0.6.0"],
    description="",
    license="MIT",
    url='https://github.com/Shapeways/shapeways-api',
    classifiers=[
        "Intended Audience :: Developers",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2.6",
        "Programming Language :: Python :: 2.7",
        "License :: OSI Approved :: MIT License",
    ],
)
