Gitneat is a small CLI application for initializing local &amp; remote repositories. It presents multiple added benefits over the traditional `git init`.

## Highlights

-   Automatically creates a remote repository linked to your local repo
-   Creates a gitignore, which you can either populate by selecting files or use one of the Github templates

## Install

```console
$ npm i -g gitneat
```

## Usage

Run the gitneat command inside the directory you want to init:

```console
$ gitneat
```

You will be asked to authenticate with Github- both standard and 2FA authentication are supported.

Once authenticated, gitneat will run you through a repo setup wizard.
If the folder already contains a `.git` directory, the tool will exit.

## Maintainers

Daniel LeSage [https://github.com/dlesage25]
