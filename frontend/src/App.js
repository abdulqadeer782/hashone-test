import { Card, Layout } from 'antd'
import './App.css';
import Tasks from './pages/Task';
import TopFrameImg from './assets/top-frame.png'

function App() {
    return (
        <Layout className='main-layout'>
            <Layout.Content className='main-content'>
                <div className='top-frame' />
                <Tasks />
            </Layout.Content>
        </Layout>
    );
}

export default App;
