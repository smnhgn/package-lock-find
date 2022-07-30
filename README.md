
# package-lock-find

A CLI Tool to analyze packages/dependencies in your package-lock.json


## Usage

```
Usage: package-lock-find [options] <package/dependency>

Arguments:
  package/dependency  name of package/dependency

Options:
  -v, --version       output the version number
  -p, --path <path>   path to package-lock.json (default: "./")
  -h, --help          display help for command
```

Example
```bash
  npx package-lock-find is-number
```

Output
```
has-values@1.0.0 => is-number@3.0.0
is-number@7.0.0
sane@4.1.0 => is-number@3.0.0
```