import express from 'express';
import testRouter from './routes/test';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', testRouter);

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
}); 