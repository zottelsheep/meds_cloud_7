from setuptools import setup, find_namespace_packages

INSTALL_REQ = [
    "flask"
]

EXTRAS_REQ = dict (
    dev=["pytest", "pytest-mock", "pytest-cov"]
   )

setup(
    name='meds_cloud7-frontend',
    install_requires=INSTALL_REQ,
    extras_require=EXTRAS_REQ,
    packages=find_namespace_packages(include=['meds_cloud.*'])
)
