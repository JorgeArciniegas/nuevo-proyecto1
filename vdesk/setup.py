from setuptools import find_packages, setup

setup(
    name="vdesk",
    version="0.0.1",
    packages=find_packages(),
    package_data={
        "vdesk": [
            "dbt-project/**/*",
        ],
    },
    install_requires=[
        "dagster",
        "dagster-cloud",
        "dagster-dbt",
        "dbt-postgres<1.9",
    ],
    extras_require={
        "dev": [
            "dagster-webserver",
        ]
    },
)

