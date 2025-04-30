import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes.js';

const app = express();
const port = 5010;

app.use(cors());
app.use(express.json());

app.use('/students', studentRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});