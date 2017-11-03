export default ctx => {
  const {REGION = 'eu-central-1'} = ctx.config
  return REGION
}
