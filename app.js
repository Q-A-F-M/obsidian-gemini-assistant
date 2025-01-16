// Main App Component
const App = () => {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            // For now, we'll use a placeholder response
            // We'll add actual API integration later
            const assistantMessage = {
                role: 'assistant',
                content: 'This is a test response. API integration coming soon!'
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

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
