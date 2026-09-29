import React, { useState } from 'react';
import { Comment, User } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { MessageSquare, Send, Trash2, Edit2, AtSign } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface CommentSectionProps {
  comments: Comment[];
  teamMembers: User[];
  onAddComment: (text: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  teamMembers,
  onAddComment,
  onDeleteComment,
}) => {
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    const lastAtIdx = val.lastIndexOf('@');
    if (lastAtIdx !== -1 && lastAtIdx >= val.length - 15 && !val.substring(lastAtIdx).includes(' ')) {
      setShowMentionMenu(true);
      setMentionFilter(val.substring(lastAtIdx + 1));
    } else {
      setShowMentionMenu(false);
    }
  };

  const insertMention = (member: User) => {
    const lastAtIdx = text.lastIndexOf('@');
    const newText = text.substring(0, lastAtIdx) + `@${member.name} `;
    setText(newText);
    setShowMentionMenu(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment(text);
      setText('');
      setShowMentionMenu(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMembers = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Discussion ({comments.length})
          </h3>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-3 bg-white dark:bg-gray-900 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Write a comment... (Type @ to mention team members)"
            rows={3}
            className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <AtSign className="w-3 h-3" /> Type @ to mention
            </span>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              disabled={!text.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>

        {/* Mention Dropdown */}
        {showMentionMenu && filteredMembers.length > 0 && (
          <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-1 z-30 max-h-48 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800">
              Mention Team Member
            </div>
            {filteredMembers.map((member) => (
              <button
                key={member._id}
                type="button"
                onClick={() => insertMention(member)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-lg transition-colors"
              >
                <Avatar name={member.name} src={member.avatar} size="xs" />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{member.name}</span>
                  <span className="text-[10px] text-gray-400 block">{member.role}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm flex items-start gap-3"
            >
              <Avatar name={comment.author?.name || 'User'} src={comment.author?.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">
                      {comment.author?.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                      {comment.author?.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    {(user?._id === comment.author?._id || user?.role === 'Admin') && (
                      <button
                        onClick={() => onDeleteComment(comment._id)}
                        className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
