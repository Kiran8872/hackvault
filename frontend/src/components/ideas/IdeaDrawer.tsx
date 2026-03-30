import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import type { Idea, IdeaStatus, Comment } from '../../types';
import { STATUS_ICONS, STATUS_LABEL } from '../../data/constants';
import Badge from '../ui/Badge';

export default function IdeaDrawer() {
  const { state, dispatch, vote } = useApp();
  const [commentText, setCommentText] = useState('');
  const idea = state.ideas.find((i: Idea) => i.id === state.drawerIdeaId);
  const isVoted = idea ? state.votedIds.has(idea.id) : false;

  if (!idea) return null;

  const handleComment = () => {
    if (!commentText.trim()) return;
    dispatch({ type: 'ADD_COMMENT', id: idea.id, author: state.profile.name, text: commentText });
    setCommentText('');
  };

  return (
    <>
      <div className={`drawer-overlay ${state.drawerIdeaId ? 'open' : ''}`} onClick={() => dispatch({ type: 'CLOSE_DRAWER' })}></div>
      <div className={`drawer ${state.drawerIdeaId ? 'open' : ''}`}>
        <div className="drawer-head">
          <div style={{ flex: 1 }}>
            <div className="drawer-title">{idea.title}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
               <Badge type={idea.status}>{STATUS_ICONS[idea.status as IdeaStatus]} {STATUS_LABEL[idea.status as IdeaStatus]}</Badge>
               <Badge type="domain">{idea.domain}</Badge>
            </div>
          </div>
          <div className="drawer-close" onClick={() => dispatch({ type: 'CLOSE_DRAWER' })}>✕</div>
        </div>
        
        <div className="drawer-body">
          {/* Overview */}
          <div className="drawer-section-title">Overview</div>
          <div className="drawer-meta-grid">
            <div className="drawer-meta-item">
              <div className="drawer-meta-label">Submitted by</div>
              <div className="drawer-meta-val">{idea.createdByName}</div>
            </div>
            <div className="drawer-meta-item">
              <div className="drawer-meta-label">Date</div>
              <div className="drawer-meta-val">{new Date(idea.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="drawer-meta-item">
              <div className="drawer-meta-label">Domain</div>
              <div className="drawer-meta-val">{idea.domain}</div>
            </div>
            <div className="drawer-meta-item">
              <div className="drawer-meta-label">Activity</div>
              <div className="drawer-meta-val">{idea.recentVotesLastHour > 0 ? `⚡ ${idea.recentVotesLastHour}/h` : 'Quiet'}</div>
            </div>
          </div>
          
          {/* Description */}
          <div className="drawer-section-title">Description</div>
          <div className="drawer-desc">{idea.description}</div>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <>
              <div className="drawer-section-title">Tags</div>
              <div className="tags">
                {idea.tags.map((tag: string) => <span key={tag} className="tag-chip">{tag}</span>)}
              </div>
            </>
          )}
          
          {/* Voting */}
          <div className="drawer-section-title">Voting</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="vote-display">{idea.totalVoteWeight}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>VOTES</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>
                {isVoted ? 'You have supported this idea' : 'Cast your vote to support this idea'}
              </div>
              <button 
                className={`btn ${isVoted ? 'btn-danger' : 'btn-primary'} btn-sm`} 
                onClick={() => vote(idea.id)}
              >
                {isVoted ? 'Remove Vote' : '👍 Upvote'}
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="drawer-section-title">Discussion ({idea.cmts?.length || 0})</div>
          <div className="comment-form" style={{ marginBottom: '16px' }}>
            <textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
            />
            <button className="btn btn-primary btn-sm" onClick={handleComment} style={{ marginTop: '8px' }} disabled={!commentText.trim()}>
              Post Comment
            </button>
          </div>
          
          <div className="comment-list">
            {idea.cmts && idea.cmts.length > 0 ? (
              idea.cmts.map((c: Comment, idx: number) => (
                <div key={idx} className="comment-item">
                  <div className="comment-hd">
                    <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                      {c.u.charAt(0).toUpperCase()}
                    </div>
                    <span className="comment-author">{c.u}</span>
                    <span className="comment-time">Just now</span>
                  </div>
                  <div className="comment-text">{c.t}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '12px', padding: '16px' }}>
                No comments yet — be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
