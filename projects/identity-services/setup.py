#!/usr/bin/env python

from setuptools import setup, find_packages

setup(
    name="the_game_identity_services",
    version="0.1.0",
    description="Identity services for The Game",
    author="Kevin McCartney",
    author_email="hello@kevinmccartney.is",
    url="https://the-game.kevinmccartney.dev",
    py_modules=find_packages(),
    install_requires=[
        "firebase-admin",
        "google-cloud-logging",
        "google-cloud-firestore",
        "google-cloud-functions",
    ],
)
