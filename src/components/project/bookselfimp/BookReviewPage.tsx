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
              <div className="mb-3">
                <strong className="text-neutral-dark">Desires:</strong>
                <ul className="list-disc list-inside text-neutral-medium mt-1">
                  {marketResearch.targetAudience.desires.map((desire: string, index: number) => (
                    <li key={index}>{desire}</li>
                  ))}
                </ul>
              </div>
              {marketResearch.targetAudience.dailyLife && (
                <div>
                  <strong className="text-neutral-dark">Daily Life Context:</strong>
                  <p className="text-neutral-medium mt-1">{marketResearch.targetAudience.dailyLife}</p>
                </div>
              )}
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
              {marketResearch.recommendations.pricing && (
                <div className="mt-4 pt-4 border-t border-neutral-light">
                  <strong className="text-neutral-dark">Pricing Strategy:</strong>
                  <div className="mt-2">
                    <span className="text-lg font-semibold text-primary">{marketResearch.recommendations.pricing.suggested}</span>
                    <p className="text-sm text-neutral-medium mt-1">{marketResearch.recommendations.pricing.reasoning}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Specifications */}
            {(marketResearch.readingLevel || marketResearch.design || marketResearch.contentSpecs) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-primary mr-2" />
                  <h2 className="text-xl font-heading font-semibold text-secondary">
                    Content Specifications
                  </h2>
                </div>
                {marketResearch.readingLevel && (
                  <div className="mb-4">
                    <strong className="text-neutral-dark">Reading Level:</strong>
                    <span className="text-neutral-medium ml-2">{marketResearch.readingLevel} ({marketResearch.gradeLevel})</span>
                  </div>
                )}
                {marketResearch.sentenceLength && (
                  <div className="mb-4">
                    <strong className="text-neutral-dark">Sentence Length:</strong>
                    <span className="text-neutral-medium ml-2">{marketResearch.sentenceLength}</span>
                  </div>
                )}
                {marketResearch.vocabularyLevel && (
                  <div className="mb-4">
                    <strong className="text-neutral-dark">Vocabulary Level:</strong>
                    <span className="text-neutral-medium ml-2">{marketResearch.vocabularyLevel}</span>
                  </div>
                )}
                {marketResearch.design && (
                  <div className="mb-4">
                    <strong className="text-neutral-dark">Visual Elements:</strong>
                    <span className="text-neutral-medium ml-2">{marketResearch.design.visualElements} per chapter</span>
                  </div>
                )}
                {marketResearch.contentSpecs && (
                  <div className="space-y-2">
                    <div>
                      <strong className="text-neutral-dark">Examples per Chapter:</strong>
                      <span className="text-neutral-medium ml-2">{marketResearch.contentSpecs.examplesPerChapter}</span>
                    </div>
                    <div>
                      <strong className="text-neutral-dark">Include Exercises:</strong>
                      <span className="text-neutral-medium ml-2">{marketResearch.contentSpecs.exerciseInclusion === 'true' ? 'Yes' : 'No'}</span>
                    </div>
                    {marketResearch.contentSpecs.specialInstructions && (
                      <div>
                        <strong className="text-neutral-dark">Special Instructions:</strong>
                        <p className="text-neutral-medium mt-1">{marketResearch.contentSpecs.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
                {/* Cover Page Details */}
                <div className="mb-6 pb-6 border-b border-neutral-light">
                  <div className="text-center">
                    <h3 className="font-heading text-2xl font-bold text-secondary mb-2">
                      {localStructure.coverPageDetails?.title || localStructure.title}
                    </h3>
                    <p className="text-neutral-medium text-lg mb-4">
                      {localStructure.coverPageDetails?.subtitle || localStructure.subtitle}
                    </p>
                    <p className="text-neutral-dark text-base">
                      By: {localStructure.coverPageDetails?.authorName || 'Username'}
                    </p>
                  </div>
                </div>

                {/* Front matter sections */}
                <div className="mb-6">
                  <strong className="text-neutral-dark mb-2 block">Acknowledgements:</strong>
                  <p className="text-neutral-medium text-sm leading-relaxed">
                    {localStructure.acknowledgement || 
                    "I would like to express my deepest gratitude to all those who have supported me throughout this journey. To my family and friends who provided unwavering encouragement, to my mentors who shared their wisdom and guidance, and to the countless individuals whose stories and experiences have shaped the insights within these pages. Special thanks to the readers who will bring these words to life through their own interpretations and applications. This work would not have been possible without the collective support of this incredible community that continues to inspire and challenge me to grow both personally and professionally."}
                  </p>
                </div>

                <div className="mb-6">
                  <strong className="text-neutral-dark mb-2 block">Prologue:</strong>
                  <p className="text-neutral-medium text-sm leading-relaxed">
                    {localStructure.prologue ? 
                      (localStructure.prologue.split(' ').length > 75 ? 
                        localStructure.prologue.split(' ').slice(0, 75).join(' ') + '...' : 
                        localStructure.prologue
                      ) : 
                      "The journey toward self-improvement begins with a single step, yet many find themselves standing at the crossroads of intention and action, unsure of which path will lead to lasting transformation. This book emerged from years of research, personal experience, and countless conversations with individuals who, like you, sought meaningful change in their lives. What started as a simple question about why some people thrive while others struggle has evolved into a comprehensive exploration of the principles, practices, and mindset shifts that separate those who merely dream of better lives from those who actually create them..."}
                  </p>
                  {localStructure.prologue && localStructure.prologue.split(' ').length > 75 && (
                    <p className="text-xs text-neutral-light mt-1">Full prologue: ~1,500 words</p>
                  )}
                </div>

                <div className="mb-6">
                  <strong className="text-neutral-dark mb-2 block">Introduction:</strong>
                  <p className="text-neutral-medium text-sm leading-relaxed">
                    {localStructure.introduction ? 
                      (localStructure.introduction.split(' ').length > 75 ? 
                        localStructure.introduction.split(' ').slice(0, 75).join(' ') + '...' : 
                        localStructure.introduction
                      ) : 
                      "In a world where self-help books line the shelves and motivational content floods our social media feeds, you might wonder why another book on self-improvement is necessary. The answer lies not in what this book promises to teach you, but in how it approaches the fundamental challenge of personal transformation. Unlike traditional approaches that focus solely on external behaviors or quick fixes, this comprehensive guide addresses the interconnected systems of mind, body, and spirit that must align for genuine, lasting change to occur. Through evidence-based strategies, practical exercises, and real-world applications, we will explore the architecture of human potential..."}
                  </p>
                  {localStructure.introduction && localStructure.introduction.split(' ').length > 75 && (
                    <p className="text-xs text-neutral-light mt-1">Full introduction: ~3,000-3,500 words</p>
                  )}
                </div>

                {/* Parts and their chapters */}
                {localStructure.parts && localStructure.parts.length > 0 && (
                  <div className="space-y-8">
                    {localStructure.parts.map((part: any, partIndex: number) => (
                        <div key={partIndex} className="border-t border-neutral-light pt-4">
                        <h3 className="font-heading text-lg font-semibold text-secondary mb-4">
                          Part {part.partNumber}: {part.partTitle}
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
                                      <span>{chapter.title.toLowerCase().startsWith('chapter') ? '' : 'Chapter '}{chapter.number > 0 ? `${chapter.number}: ` : ''}{chapter.title}</span>
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
                                  {(chapter.keyPoints || (chapter.metadata && chapter.metadata.keyTopics)) && (
                                    <div className="mt-3">
                                      <strong className="text-xs text-neutral-dark block mb-1">Key Points:</strong>
                                      <ul className="list-disc list-inside text-xs text-neutral-medium space-y-0.5">
                                        {(chapter.keyPoints || chapter.metadata.keyTopics).map((point: string, i: number) => (
                                          <li key={i}>{point}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  <p className="text-xs text-neutral-medium mt-3">
                                    ~{chapter.estimatedWords || (chapter.metadata && chapter.metadata.estimatedWords) || 0} words
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
                                {(chapter.keyPoints || (chapter.metadata && chapter.metadata.keyTopics)) && (
                                  <div className="mt-2">
                                    <strong className="text-xs text-neutral-dark block mb-0.5">Key Points:</strong>
                                    <ul className="list-disc list-inside text-xs text-neutral-medium space-y-0.5">
                                      {(chapter.keyPoints || chapter.metadata.keyTopics).map((point: string, i: number) => (
                                        <li key={i}>{point}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                <p className="text-xs text-neutral-medium mt-2">
                                  ~{chapter.estimatedWords || (chapter.metadata && chapter.metadata.estimatedWords) || 0} words
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
                <div className="mt-6">
                  <strong className="text-neutral-dark mb-2 block">Conclusion:</strong>
                  <p className="text-neutral-medium text-sm leading-relaxed">
                    {localStructure.conclusion ? 
                      (localStructure.conclusion.split(' ').length > 75 ? 
                        localStructure.conclusion.split(' ').slice(0, 75).join(' ') + '...' : 
                        localStructure.conclusion
                      ) : 
                      "As we reach the end of this transformative journey together, it's important to recognize that true self-improvement is not a destination but an ongoing process of growth, discovery, and renewal. The strategies, insights, and tools you've encountered throughout these pages are not meant to be consumed once and forgotten, but rather to be revisited, refined, and integrated into the fabric of your daily existence. The path forward will inevitably include moments of triumph and setback, clarity and confusion, motivation and doubt—and this is exactly as it should be for genuine, lasting transformation..."}
                  </p>
                  {localStructure.conclusion && localStructure.conclusion.split(' ').length > 75 && (
                    <p className="text-xs text-neutral-light mt-1">Full conclusion: ~2,000-2,500 words</p>
                  )}
                </div>

                {/* Appendix */}
                <div className="mt-6 pt-4 border-t border-neutral-light">
                  <strong className="text-neutral-dark mb-3 block">Appendix (Alphabetical Order):</strong>
                  <div className="space-y-2">
                    {localStructure.appendix ? (
                      <p className="text-neutral-medium text-sm">{localStructure.appendix}</p>
                    ) : (
                      <ul className="list-disc list-inside text-neutral-medium text-sm space-y-1">
                        <li><strong>A.</strong> Assessment Tools and Worksheets</li>
                        <li><strong>B.</strong> Book Recommendations for Further Reading</li>
                        <li><strong>C.</strong> Community Resources and Support Groups</li>
                        <li><strong>D.</strong> Daily Practice Templates</li>
                        <li><strong>E.</strong> Emergency Action Plans for Setbacks</li>
                        <li><strong>F.</strong> Frequently Asked Questions</li>
                        <li><strong>G.</strong> Goal-Setting Frameworks</li>
                        <li><strong>H.</strong> Habit Tracking Templates</li>
                        <li><strong>I.</strong> Implementation Checklists</li>
                        <li><strong>J.</strong> Journal Prompts for Self-Reflection</li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* References */}
                <div className="mt-6 pt-4 border-t border-neutral-light">
                  <strong className="text-neutral-dark mb-3 block">References:</strong>
                  <div className="text-neutral-medium text-xs space-y-2">
                    {localStructure.references ? (
                      <p>{localStructure.references}</p>
                    ) : (
                      <div className="space-y-1">
                        <p>Brown, B. (2020). <em>The Gifts of Imperfection</em>. Hazelden Publishing.</p>
                        <p>Clear, J. (2018). <em>Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones</em>. Avery.</p>
                        <p>Duckworth, A. (2016). <em>Grit: The Power of Passion and Perseverance</em>. Scribner.</p>
                        <p>Dweck, C. (2006). <em>Mindset: The New Psychology of Success</em>. Random House.</p>
                        <p>Frankl, V. E. (1946). <em>Man's Search for Meaning</em>. Beacon Press.</p>
                        <p>Heath, C., & Heath, D. (2010). <em>Switch: How to Change Things When Change Is Hard</em>. Broadway Books.</p>
                        <p>Kahneman, D. (2011). <em>Thinking, Fast and Slow</em>. Farrar, Straus and Giroux.</p>
                        <p>Pink, D. H. (2009). <em>Drive: The Surprising Truth About What Motivates Us</em>. Riverhead Books.</p>
                        <p>Sinek, S. (2009). <em>Start with Why: How Great Leaders Inspire Everyone to Take Action</em>. Portfolio.</p>
                        <p>Thaler, R. H., & Sunstein, C. R. (2008). <em>Nudge: Improving Decisions About Health, Wealth, and Happiness</em>. Yale University Press.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-neutral-medium">
                  <strong>Total word count:</strong> {localStructure.totalWords?.toLocaleString() || 'Not calculated'}
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
