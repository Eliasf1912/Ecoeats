import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT_EXPRESS || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});