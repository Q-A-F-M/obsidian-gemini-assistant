// Main App Component
const App = () => {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [apiKey, setApiKey] = React.useState('');
    const [isConfigured, setIsConfigured] = React.useState(false);

    const setupApiKey = (key) => {
        setApiKey(key);
        setIsConfigured(true);
        // Store in session storage (cleared when browser closes)
        sessionStorage.setItem('gemini_key', key);
    };

    // Check for stored API key on load
    React.useEffect(() => {
        const storedKey = sessionStorage.getItem('gemini_key');
        if (storedKey) {
            setupApiKey(storedKey);
        }
    }, []);

    const callGeminiAPI = async (prompt) => {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const response = await callGeminiAPI(input);
            const assistantMessage = {
                role: 'assistant',
                content: response
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isConfigured) {
        return (
            <div className="container mx-auto p-4 h-full flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Setup Required</h2>
                    <p className="mb-4">Please enter your Google API key to continue:</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const key = e.target.apiKey.value;
                        if (key) setupApiKey(key);
                    }}>
                        <input
                            type="password"
                            name="apiKey"
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Enter your API key"
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save API Key
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 h-full">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md h-full flex flex-col">
                {/* Chat messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
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

                {/* Input form */}
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
