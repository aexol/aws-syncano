function getSocketURL(ctx, instance, socket) {
  return `${instance.url(ctx.meta.instance)}endpoints/sockets/${socket}`;
}

function defaultAuth(ctx, instance) {
  return getSocketURL(ctx, instance, 'simple-service-auth/auth/');
}

function defaultBootstrap(ctx, instance) {
  return getSocketURL(ctx, instance, 'aws-ethereum/bootstrap/');
}

function defaultEnvironment(ctx, instance) {
  return getSocketURL(ctx, instance, 'aws-ethereum/environment/');
}

export {getSocketURL, defaultAuth, defaultBootstrap, defaultEnvironment};
