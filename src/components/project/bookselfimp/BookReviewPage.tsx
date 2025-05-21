import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import { ChevronLeft, Check, Edit, Palette, Target, FileText } from 'lucide-react'
import { cn } from '../../../lib/utils'

const BookReviewPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { marketResearch, structure } = location.state || {}
  
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [localStructure, setLocalStructure] = useState(structure)

  if (!marketResearch || !structure) {
    navigate(`/book/${bookId}/edit`)
    return null
  }

  const handleApprove = () => {
    // Navigate to the book editor
    navigate(`/book/${bookId}/edit`)
  }

  const handleEditChapter = (chapterIndex: number, newTitle: string) => {
    const updatedChapters = [...localStructure.chapters]
    updatedChapters[chapterIndex].title = newTitle
    setLocalStructure({ ...localStructure, chapters: updatedChapters })
  }

  return (
    
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/new-book')}
            className="flex items-center text-neutral-medium hover:text-secondary mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Book Creation
          </button>
          <h1 className="text-3xl font-heading font-semibold text-secondary">
            Book Structure Review
          </h1>
          <p className="text-neutral-medium mt-2">
            Review the market research and book structure before proceeding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Research Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-heading font-semibold text-secondary">
                  Target Audience
                </h2>
              </div>
              <div className="text-neutral-dark mb-2">
                <strong>Demographics:</strong>
                {typeof marketResearch.targetAudience.demographics === 'object' ? (
                  <ul className="list-disc list-inside text-neutral-medium mt-1">
                    {Object.entries(marketResearch.targetAudience.demographics).map(([key, value]: [string, any]) => (
                      <li key={key}>{key}: {String(value)}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-neutral-medium"> {marketResearch.targetAudience.demographics}</span>
                )}
              </div>
              <div className="text-neutral-dark mb-4">
                <strong>Psychographics:</strong>
                {typeof marketResearch.targetAudience.psychographics === 'object' ? (
                  <ul className="list-disc list-inside text-neutral-medium mt-1">
                    {Object.entries(marketResearch.targetAudience.psychographics).map(([key, value]: [string, any]) => (
                      <li key={key}>{key}: {String(value)}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-neutral-medium"> {marketResearch.targetAudience.psychographics}</span>
                )}
              </div>
              <div className="mb-3">
                <strong className="text-neutral-dark">Pain Points:</strong>
                <ul className="list-disc list-inside text-neutral-medium mt-1">
                  {marketResearch.targetAudience.painPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-neutral-dark">Desires:</strong>
                <ul className="list-disc list-inside text-neutral-medium mt-1">
                  {marketResearch.targetAudience.desires.map((desire: string, index: number) => (
                    <li key={index}>{desire}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Palette className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-heading font-semibold text-secondary">
                  Design Recommendations
                </h2>
              </div>
              <div className="mb-4">
                <strong className="text-neutral-dark">Tone:</strong> {marketResearch.recommendations.tone}
              </div>
              <div className="mb-4">
                <strong className="text-neutral-dark">Style:</strong> {marketResearch.recommendations.style}
              </div>
              <div>
                <strong className="text-neutral-dark mb-2 block">Color Scheme:</strong>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mb-1 border"
                      style={{ backgroundColor: marketResearch.recommendations.colors.primary }}
                    ></div>
                    <span className="text-xs text-neutral-medium">Primary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mb-1 border"
                      style={{ backgroundColor: marketResearch.recommendations.colors.secondary }}
                    ></div>
                    <span className="text-xs text-neutral-medium">Secondary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mb-1 border"
                      style={{ backgroundColor: marketResearch.recommendations.colors.accent }}
                    ></div>
                    <span className="text-xs text-neutral-medium">Accent</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-medium mt-2">
                  {marketResearch.recommendations.colors.reasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Book Structure Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-heading font-semibold text-secondary">
                  Book Structure
                </h2>
              </div>
              
              <div className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-secondary mb-2">
                  {localStructure.title}
                </h3>
                <p className="text-neutral-medium">{localStructure.subtitle}</p>
              </div>

              <div className="mb-4">
                <strong className="text-neutral-dark">Market Position:</strong>
                <p className="text-neutral-medium mt-1">{localStructure.marketPosition}</p>
              </div>

              <div className="mb-6">
                <strong className="text-neutral-dark">Unique Value:</strong>
                <p className="text-neutral-medium mt-1">{localStructure.uniqueValue}</p>
              </div>

              <div className="space-y-6">
                {/* Front matter sections if they exist */}
                {localStructure.acknowledgement && (
                  <div className="mb-4">
                    <strong className="text-neutral-dark mb-2 block">Acknowledgement:</strong>
                    <p className="text-neutral-medium">{localStructure.acknowledgement}</p>
                  </div>
                )}

                {localStructure.prologue && (
                  <div className="mb-4">
                    <strong className="text-neutral-dark mb-2 block">Prologue:</strong>
                    <p className="text-neutral-medium">{localStructure.prologue}</p>
                  </div>
                )}

                {localStructure.introduction && (
                  <div className="mb-4">
                    <strong className="text-neutral-dark mb-2 block">Introduction:</strong>
                    <p className="text-neutral-medium">{localStructure.introduction}</p>
                  </div>
                )}

                {/* Parts and their chapters */}
                {localStructure.parts && localStructure.parts.length > 0 && (
                  <div className="space-y-8">
                    {localStructure.parts.map((part: any, partIndex: number) => (
                        <div key={partIndex} className="border-t border-neutral-light pt-4">
                        <h3 className="font-heading text-lg font-semibold text-secondary mb-4">
                          {part.title}
                        </h3>
                        
                        <div className="space-y-6 pl-4">
                          {part.chapters && part.chapters.map((chapter: any, chapterIndex: number) => (
                            <div key={chapterIndex} className="border-b border-neutral-light pb-6 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-secondary text-lg">
                                    {editingSection === `part-${partIndex}-chapter-${chapterIndex}` ? (
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={chapter.title}
                                          onChange={(e) => {
                                            const updatedParts = [...localStructure.parts];
                                            updatedParts[partIndex].chapters[chapterIndex].title = e.target.value;
                                            setLocalStructure({ ...localStructure, parts: updatedParts });
                                          }}
                                          className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <button
                                          onClick={() => setEditingSection(null)}
                                          className="p-1 text-primary hover:text-primary-hover"
                                        >
                                          <Check className="w-5 h-5" />
                                        </button>
                                      </div>
                                    ) : (
                                  <div className="flex items-center">
                                    <div>
                                      <span>Chapter {chapter.number}: {chapter.title}</span>
                                      <button
                                        onClick={() => setEditingSection(`part-${partIndex}-chapter-${chapterIndex}`)}
                                        className="p-1 text-neutral-medium hover:text-primary ml-2"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                    )}
                                  </h4>
                                  <p className="text-neutral-medium mt-2">
                                    {chapter.description}
                                  </p>
                                  <p className="text-xs text-neutral-medium mt-3">
                                    ~{chapter.estimatedWords || 0} words
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Standalone chapters (if not organized in parts) */}
                {localStructure.chapters && localStructure.chapters.length > 0 && (
                  <div>
                    <strong className="text-neutral-dark mb-3 block">Chapters:</strong>
                    <div className="space-y-3">
                      {localStructure.chapters.map((chapter: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          {editingSection === `chapter-${index}` ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={chapter.title}
                                onChange={(e) => handleEditChapter(index, e.target.value)}
                                className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                              <button
                                onClick={() => setEditingSection(null)}
                                className="p-1 text-primary hover:text-primary-hover"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-neutral-dark">
                                  Chapter {chapter.number}: {chapter.title}
                                </h4>
                                <p className="text-sm text-neutral-medium mt-1">
                                  {chapter.description}
                                </p>
                                <p className="text-xs text-neutral-medium mt-2">
                                  ~{chapter.estimatedWords} words
                                </p>
                              </div>
                              <button
                                onClick={() => setEditingSection(`chapter-${index}`)}
                                className="p-1 text-neutral-medium hover:text-primary ml-2"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conclusion */}
                {localStructure.conclusion && (
                  <div className="mt-4">
                    <strong className="text-neutral-dark mb-2 block">Conclusion:</strong>
                    <p className="text-neutral-medium">{localStructure.conclusion}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-neutral-medium">
                  <strong>Total word count:</strong> {localStructure.totalWords.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/new-book')}
                className={cn(
                  "flex-1 px-6 py-3 rounded-lg border border-neutral-light",
                  "text-neutral-medium hover:text-secondary hover:border-secondary",
                  "transition-colors"
                )}
              >
                Start Over
              </button>
              <button
                onClick={handleApprove}
                className={cn(
                  "flex-1 px-6 py-3 rounded-lg bg-primary text-white",
                  "hover:bg-primary-hover transition-colors"
                )}
              >
                Approve & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default BookReviewPage