import os

from setuptools import setup


def find_binaries():
    bin_dir = os.path.join(os.path.dirname(__file__), 'bin')
    return [os.path.join(bin_dir, x) for x in os.listdir(bin_dir)]


setup(
    name='kobra',
    version='1.0.0',
    packages=['kobra'],
    scripts=find_binaries(),
    url='https://github.com/karservice/kobra',
    license='MIT',
    author='Kårservice Östergötland AB',
    author_email='it@karservice.se',
    description=''
)
