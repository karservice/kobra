# SCSS
The file `index.scss` is the "root" SCSS file. That means that any added file
must be imported to that one.

The actual CSS is compiled by Sass.

## Bootstrap variables
The Bootstrap variables are defined by `kobra/variables` and
`bootstrap/variables` together. `kobra/variables` should only contain overrides
and the default variables needed to define those overrides, nothing more. This
makes it very easy to visualize what variables are actually overridden, and it
facilitates upgrades of the Bootstrap framework considerably.
