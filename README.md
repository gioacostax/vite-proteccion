This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## 3HTP resume

src                       -Directory with the project without compiling

build                     -Directory with the compiled project

.env                      -Define the application variables

Dockerfile                -Contains the settings required to create a base image

nginx                     -Directory with the configuration of the module "ngx_http_headers_more_filter_module.so" and Security policies recommended by Owasp.org

docker-entrypoint.sh      -Run an executable in the container at startup for application variable settings

k8s                       -Contains the kubernetes manifests for deployment on the EKS cluster



**You must set **INLINE_RUNTIME_CHUNK** environment variable to false, the script will not be embedded and will be imported as usual.**
https://medium.com/@nrshahri/csp-cra-324dd83fe5ff
 ```shell
export INLINE_RUNTIME_CHUNK=false
 ```

### edit /etc/hosts
```
127.0.0.1       hola.proteccion.com.co
```

 ### run in docker
 ```
docker build -t proteccion-react .
docker run -it -d --name proteccion-react -p 80:80 --env contentSecurityPolicy="default-src 'self' *.proteccion.com.co; script-src 'self' *.proteccion.com.co; img-src 'self' *; style-src 'self' *.proteccion.com.co; connect-src 'self' *.proteccion.com.co" proteccion-react
 ```