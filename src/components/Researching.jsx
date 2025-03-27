import React, { useRef, useEffect, useState } from 'react';
import { 
  Lightbulb,
  FlaskConical,
  Bookmark,
  Search,
  ClipboardList,
  FileText,
  BookOpen,
  CheckCircle,
  Link,
  Code,
  BrainCircuit,
  Loader2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const THINKING_STATES = [
  { icon: Search, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Getting  sources...' },
  { icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Analyzing information...' },
  { icon: FileText, color: 'text-green-500', bg: 'bg-green-50', label: 'using my Second Brain...' },
  { icon: CheckCircle, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'A T L A S  verifying...' }
];

const iconComponents = {
  idea: Lightbulb,
  experiment: FlaskConical,
  bookmark: Bookmark,
  search: Search,
  note: ClipboardList,
  document: FileText,
  reference: BookOpen,
  completion: CheckCircle,
  link: Link,
  code: Code
};

export default function Researching({ data }) {
  const scrollRef = useRef(null);
  const [currentState, setCurrentState] = useState(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });

    if (data.length > 0) {
      const simulateThinking = async () => {
        for (const state of THINKING_STATES) {
          setCurrentState(state);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        setCurrentState(null);
      };

      simulateThinking();
    }
  }, [data]);

  const getIcon = (type) => {
    const Icon = iconComponents[type] || Lightbulb;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div 
      ref={scrollRef}
      className="relative w-full mx-auto px-4 md:px-8 lg:px-12 py-6 h-[80vh] overflow-y-auto"
    >
      <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200"></div>
      
      <div className="space-y-1">
        {data.map((item, index) => (
          <div 
            key={index}
            className="relative pl-10 pb-8 group transition-all duration-200"
          >
            <div className="absolute left-7 top-1 h-4 w-4 rounded-full bg-blue-500 border-4 border-white z-10 shadow"></div>
            
            <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-blue-300 text-blue-500 group-hover:bg-blue-50 transition-all shadow-sm">
              {getIcon(item.type)}
            </div>
            
            <div className="pt-1">
              <div className="text-xs text-gray-400 mb-1 font-mono">
                {new Date(item.timestamp || Date.now()).toLocaleString()}
              </div>
              
              <h3 className="font-medium text-gray-800 mb-1.5 flex items-center gap-2">
                {getIcon(item.type)}
                {item.label}
              </h3>
              
              {item.content && (
                <div className="text-gray-700 leading-relaxed bg-white/50 px-4 py-3 rounded-lg border border-gray-200 markdown-content shadow-sm">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="my-2 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                            <div className="px-3 py-1 bg-gray-100 text-xs text-gray-600 font-mono">
                              {match[1]}
                            </div>
                            <pre className="p-3 overflow-x-auto">
                              <code className={`hljs ${className}`} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800">
                            {children}
                          </code>
                        );
                      },
                      p({node, children, ...props}) {
                        return <p className="mb-4 last:mb-0" {...props}>{children}</p>
                      }
                    }}
                  >
                    {item.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            {index < data.length - 1 && (
              <div className="absolute left-7 top-6 bottom-0 w-0.5 bg-blue-200"></div>
            )}
          </div>
        ))}
        
        {currentState && (
          <div className={`relative pl-10 pb-8`}>
            <div className="absolute left-7 top-1 h-4 w-4 rounded-full bg-blue-500 border-4 border-blue-100 z-10 animate-pulse"></div>
            <div className={`absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full ${currentState.bg} border-2 ${currentState.color}`}>
              <currentState.icon className={`w-4 h-4 ${currentState.color}`} />
            </div>
            <div className="pt-1">
              <div className="text-xs text-gray-400 mb-1 font-mono">
                {new Date().toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-800 flex items-center">
                  {currentState.label}
                </h3>
                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Lightbulb className="mx-auto h-8 w-8 mb-2" />
          <p>Your research log is empty</p>
          <p className="text-sm">Add your first observation to begin</p>
        </div>
      )}
    </div>
  );
}