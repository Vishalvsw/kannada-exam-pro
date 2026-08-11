'use client';

export default function AnswerExplanation({ 
  correctAnswer, 
  explanation, 
  examTip,
  subject,
  difficulty 
}) {
  if (!explanation && !examTip) return null;
  
  return (
    <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-sm font-bold">📚</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-blue-800 mb-2">
            Why this is the correct answer
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {explanation || `The correct answer is: ${correctAnswer}`}
          </p>
          
          {subject && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                📖 {subject}
              </span>
              {difficulty && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  ⚡ {difficulty}
                </span>
              )}
            </div>
          )}
          
          {examTip && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800 leading-relaxed">
                💡 <strong>Exam Tip:</strong> {examTip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
