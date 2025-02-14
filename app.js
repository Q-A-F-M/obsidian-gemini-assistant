'use strict';

const App = () => {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [apiKey, setApiKey] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: input
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            const assistantMessage = {
                role: 'assistant',
                content: data.candidates[0].content.parts[0].text
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error details:', error);
            const errorMessage = {
                role: 'assistant',
                content: `Error: ${error.message}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
            setInput('');
        }
    };

    const appContent = apiKey ? (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
                <div className="p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-3/4 p-3 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100'
                                }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="border-t p-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-2 border rounded"
                            disabled={isProcessing}
                        />
                        <button
                            type="submit"
                            disabled={isProcessing || !input.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            {isProcessing ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    ) : (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Enter API Key</h2>
                <input
                    type="password"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Paste your API key here"
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </div>
        </div>
    );

    return appContent;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
