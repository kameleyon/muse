import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mic, Timer, HelpCircle, FileText, Loader2, XCircle, Download } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as deliveryService from '@/services/deliveryService';

const PresenterTools: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [speakerNotes, setSpeakerNotes] = useState<deliveryService.SpeakerNotes[] | null>(null);
  const [qaPreparation, setQAPreparation] = useState<deliveryService.QAPreparation | null>(null);
  const [rehearsalFeedback, setRehearsalFeedback] = useState<deliveryService.RehearsalFeedback | null>(null);
  const [leaveBehindDoc, setLeaveBehindDoc] = useState<deliveryService.LeaveBehindDoc | null>(null);
  
  // Get project ID and editor content from store
  const { projectId, editorContent } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  const handleGenerateNotes = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for speaker notes'
      }));
      return;
    }
    
    setIsLoading(true);
    setActiveOperation('notes');
    setSpeakerNotes(null);
    
    try {
      const notes = await deliveryService.generateSpeakerNotes(projectId, editorContent);
      setSpeakerNotes(notes);
      
      dispatch(addToast({
        type: 'success',
        message: `Generated speaker notes for ${notes.length} slides`
      }));
    } catch (error) {
      console.error('Failed to generate speaker notes:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate speaker notes'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleStartRehearsal = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for rehearsal'
      }));
      return;
    }
    
    setIsLoading(true);
    setActiveOperation('rehearsal');
    setRehearsalFeedback(null);
    
    try {
      // In a real implementation, we would start a rehearsal session
      // For now, we'll simulate a completed rehearsal
      const rehearsalData = {
        duration: 600, // 10 minutes
        audioSamples: [],
        slideTimings: []
      };
      
      const feedback = await deliveryService.analyzeRehearsal(projectId, editorContent, rehearsalData);
      setRehearsalFeedback(feedback);
      
      dispatch(addToast({
        type: 'success',
        message: 'Rehearsal analysis complete'
      }));
    } catch (error) {
      console.error('Failed to analyze rehearsal:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to analyze rehearsal'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleGenerateQA = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for Q&A preparation'
      }));
      return;
    }
    
    setIsLoading(true);
    setActiveOperation('qa');
    setQAPreparation(null);
    
    try {
      const qa = await deliveryService.generateQAPreparation(projectId, editorContent);
      setQAPreparation(qa);
      
      dispatch(addToast({
        type: 'success',
        message: `Generated ${qa.anticipatedQuestions.length} Q&A items`
      }));
    } catch (error) {
      console.error('Failed to generate Q&A preparation:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate Q&A preparation'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleGenerateLeaveBehind = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for leave-behind document'
      }));
      return;
    }
    
    setIsLoading(true);
    setActiveOperation('leaveBehind');
    setLeaveBehindDoc(null);
    
    try {
      const doc = await deliveryService.generateLeaveBehindDoc(projectId, editorContent);
      setLeaveBehindDoc(doc);
      
      dispatch(addToast({
        type: 'success',
        message: 'Leave-behind document generated'
      }));
    } catch (error) {
      console.error('Failed to generate leave-behind document:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate leave-behind document'
      }));
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const closePanel = () => {
    setSpeakerNotes(null);
    setQAPreparation(null);
    setRehearsalFeedback(null);
    setLeaveBehindDoc(null);
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Presenter Support</h4>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">
              {activeOperation === 'notes' && 'Generating speaker notes...'}
              {activeOperation === 'rehearsal' && 'Analyzing rehearsal...'}
              {activeOperation === 'qa' && 'Preparing Q&A materials...'}
              {activeOperation === 'leaveBehind' && 'Creating leave-behind document...'}
              {!activeOperation && 'Processing...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Speaker Notes Panel */}
      {speakerNotes && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-sm">Speaker Notes</h5>
            <Button variant="ghost" size="sm" onClick={closePanel} className="h-6 w-6 p-0">
              <XCircle size={16} />
            </Button>
          </div>
          
          <div className="border rounded-md p-3 bg-white/50 max-h-60 overflow-y-auto">
            {speakerNotes.map((note, index) => (
              <div key={note.slideId} className="mb-3 pb-3 border-b border-neutral-light/40 last:border-b-0 last:mb-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h6 className="font-medium text-xs">{note.slideTitle}</h6>
                  <span className="text-xs text-neutral-medium">{Math.floor(note.timeEstimate / 60)}:{(note.timeEstimate % 60).toString().padStart(2, '0')}</span>
                </div>
                <p className="text-xs mb-2">{note.notes}</p>
                <div className="text-xs">
                  <strong className="text-neutral-dark">Key Points:</strong>
                  <ul className="list-disc list-inside">
                    {note.keyPoints.map((point, i) => (
                      <li key={i} className="text-neutral-medium">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Download size={14} className="mr-1" /> Export Notes
            </Button>
          </div>
        </div>
      )}
      
      {/* Rehearsal Feedback Panel */}
      {rehearsalFeedback && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-sm">Rehearsal Feedback</h5>
            <Button variant="ghost" size="sm" onClick={closePanel} className="h-6 w-6 p-0">
              <XCircle size={16} />
            </Button>
          </div>
          
          <div className="border rounded-md p-3 bg-white/50 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-2 border rounded-md bg-white/80">
                <h6 className="font-medium text-xs mb-1">Pacing</h6>
                <ul className="text-xs space-y-1">
                  {rehearsalFeedback.pacing.tooFast && <li className="text-red-600">Too fast in some sections</li>}
                  {rehearsalFeedback.pacing.tooSlow && <li className="text-yellow-600">Too slow in some sections</li>}
                  {rehearsalFeedback.pacing.inconsistent && <li className="text-yellow-600">Inconsistent pacing</li>}
                  <li className="text-neutral-medium">{rehearsalFeedback.pacing.recommendation}</li>
                </ul>
              </div>
              
              <div className="p-2 border rounded-md bg-white/80">
                <h6 className="font-medium text-xs mb-1">Clarity (Score: {rehearsalFeedback.clarity.score}/100)</h6>
                {rehearsalFeedback.clarity.unclearSections.length > 0 && (
                  <div className="text-xs mb-1">
                    <strong className="text-neutral-dark">Unclear Sections:</strong>
                    <ul className="list-disc list-inside">
                      {rehearsalFeedback.clarity.unclearSections.map((section, i) => (
                        <li key={i} className="text-neutral-medium">{section}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-neutral-medium">{rehearsalFeedback.clarity.recommendation}</p>
              </div>
            </div>
            
            <div className="p-2 border rounded-md bg-white/80 mb-3">
              <h6 className="font-medium text-xs mb-1">Engagement (Score: {rehearsalFeedback.engagement.score}/100)</h6>
              <p className="text-xs text-neutral-medium">{rehearsalFeedback.engagement.recommendation}</p>
            </div>
            
            <div className="p-2 border rounded-md bg-white/80">
              <h6 className="font-medium text-xs mb-1">Overall Assessment</h6>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <strong className="text-neutral-dark">Strengths:</strong>
                  <ul className="list-disc list-inside">
                    {rehearsalFeedback.overall.strengths.map((strength, i) => (
                      <li key={i} className="text-green-600">{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-neutral-dark">Areas for Improvement:</strong>
                  <ul className="list-disc list-inside">
                    {rehearsalFeedback.overall.areasForImprovement.map((area, i) => (
                      <li key={i} className="text-yellow-600">{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-xs text-neutral-medium mt-2">
                Total Time: {Math.floor(rehearsalFeedback.overall.timeUsed / 60)}:{(rehearsalFeedback.overall.timeUsed % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Timer size={14} className="mr-1" /> Start New Rehearsal
            </Button>
          </div>
        </div>
      )}
      
      {/* Q&A Preparation Panel */}
      {qaPreparation && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-sm">Q&A Preparation</h5>
            <Button variant="ghost" size="sm" onClick={closePanel} className="h-6 w-6 p-0">
              <XCircle size={16} />
            </Button>
          </div>
          
          <div className="border rounded-md p-3 bg-white/50 max-h-60 overflow-y-auto">
            <h6 className="font-medium text-xs mb-2">Anticipated Questions</h6>
            <div className="space-y-2 mb-3">
              {qaPreparation.anticipatedQuestions.map((qa, index) => (
                <div key={index} className="p-2 border rounded-md bg-white/80">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-medium">{qa.question}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      qa.difficulty === 'basic' ? 'bg-green-100 text-green-800' :
                      qa.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {qa.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-medium mt-1">{qa.answer}</p>
                </div>
              ))}
            </div>
            
            <h6 className="font-medium text-xs mb-2">Challenging Topics</h6>
            <ul className="list-disc list-inside text-xs mb-3">
              {qaPreparation.challengingTopics.map((topic, index) => (
                <li key={index} className="text-neutral-medium">{topic}</li>
              ))}
            </ul>
            
            <h6 className="font-medium text-xs mb-2">Supporting Data</h6>
            <div className="space-y-2">
              {qaPreparation.supportingData.map((data, index) => (
                <div key={index} className="p-2 border rounded-md bg-white/80">
                  <p className="text-xs font-medium">{data.topic}</p>
                  <p className="text-xs text-neutral-medium">{data.data}</p>
                  {data.source && <p className="text-[10px] text-neutral-medium mt-1">Source: {data.source}</p>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Download size={14} className="mr-1" /> Export Q&A Guide
            </Button>
          </div>
        </div>
      )}
      
      {/* Leave-Behind Document Panel */}
      {leaveBehindDoc && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-sm">Leave-Behind Document</h5>
            <Button variant="ghost" size="sm" onClick={closePanel} className="h-6 w-6 p-0">
              <XCircle size={16} />
            </Button>
          </div>
          
          <div className="border rounded-md p-3 bg-white/50">
            <h6 className="font-medium text-xs mb-2">{leaveBehindDoc.title}</h6>
            <div className="p-2 border rounded-md bg-white/80 max-h-40 overflow-y-auto mb-3">
              <p className="text-xs whitespace-pre-wrap">{leaveBehindDoc.content.substring(0, 500)}...</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-medium">Format: {leaveBehindDoc.format.toUpperCase()}</span>
              {leaveBehindDoc.downloadUrl && (
                <a href={leaveBehindDoc.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download size={14} className="mr-1" /> Download
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Tool Buttons (only show if no panel is open) */}
      {!speakerNotes && !qaPreparation && !rehearsalFeedback && !leaveBehindDoc && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={handleGenerateNotes}
            disabled={isLoading || !editorContent}
          >
            <FileText size={14} className="mr-1"/> Generate Speaker Notes
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={handleStartRehearsal}
            disabled={isLoading || !editorContent}
          >
            <Timer size={14} className="mr-1"/> Rehearsal Mode
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={handleGenerateQA}
            disabled={isLoading || !editorContent}
          >
            <HelpCircle size={14} className="mr-1"/> Q&A Preparation
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={handleGenerateLeaveBehind}
            disabled={isLoading || !editorContent}
          >
            <FileText size={14} className="mr-1"/> Generate Leave-Behind Doc
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PresenterTools;