import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 100 // limite each IP to 100 request per windowsMs
})

export default limiter;