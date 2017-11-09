const {npmLogin, unpublish} = require('./local_repo')

npmLogin(() => unpublish(() => {}))
