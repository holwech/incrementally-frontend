[![Netlify Status](https://api.netlify.com/api/v1/badges/330bbe5a-073e-473c-ae37-5f95684bd9a1/deploy-status)](https://app.netlify.com/sites/priceless-hodgkin-3234a5/deploys)

# A brief example

![Usage example of incrementally](public/svg_record.gif?raw=true "A brief example of incrementally in use")
Svg offers an interesting set of capabilities compared to other file types — recording of an svg even more so.

This recording functionality comes from the [drawify](https://github.com/holwech/drawify) repository.

### Developing

This example uses the `drawify` package. For developing the `drawify` package locally, a library called `npm-link-copy` is used to automatically update the package.

Run `npm install -g laggingreflex/npm-link-copy` to install, got to the project folder (`some/path/to/draw-frontend`) and run `npm-link-copy ../some/path/to/draw -w`.