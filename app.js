// Main App Component
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
            console.log('Making API request...'); // Debug log
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: input
                        }]
                    }]
                })
            });

            const data = await response.json();
            console.log('API response:', data); // Debug log

            const assistantMessage = {
                role: 'assistant',
                content: data.candidates[0].content.parts[0].text
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error details:', error);
            let errorContent = 'An error occurred';
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                errorContent = `API Error: ${errorData.error?.message || 'Unknown error'}`;
            } else {
                errorContent = `Error: ${error.message}`;
            }
            
            const errorMessage = {
                role: 'assistant',
                content: errorContent
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
            setInput('');
        }
    };

    if (!apiKey) {
        return (
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
    }

    return (
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
    );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
