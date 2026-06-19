import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Paperclip, 
  History, 
  Info, 
  Send, 
  ThumbsUp, 
  Smile, 
  User, 
  Calendar, 
  Clock, 
  Building, 
  ExternalLink,
  Bot
} from "lucide-react";
import { useTask } from "../../hooks/use-projects-tasks";
import { StatusBadge, PriorityBadge, ProgressBar } from "../../components/shared/CommonParts";
import { cn } from "@/lib/utils";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { task, isLoading, isError, history, updateTask, addComment, toggleReaction, addAttachment } = useTask(id || "");

  // Detailed tab state
  const [activeTab, setActiveTab] = useState<"description" | "comments" | "attachments" | "history">("description");

  // New Comment input
  const [commentText, setCommentText] = useState("");

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
        <span className="text-xs font-mono text-slate-505 uppercase tracking-widest animate-pulse">Reconciling task parameter registry...</span>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="py-12 bg-[#090e1a] border border-slate-900 rounded-2xl text-center max-w-sm mx-auto">
        <p className="text-xs font-mono text-rose-455 uppercase font-black">Action task node not located inside active registries</p>
        <button 
          onClick={() => navigate("/tasks")}
          className="mt-4 px-3 py-1 bg-slate-900 rounded text-slate-350 text-[10px] uppercase font-mono font-bold"
        >
          Return to pipelines
        </button>
      </div>
    );
  }

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    try {
      await addComment({
        author: "Alex Rivera", // Authenticated Admin mock
        content: commentText,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      });
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle emoji reactions
  const handleReactionClick = async (commentId: string, emoji: string) => {
    try {
      await toggleReaction({
        commentId,
        emoji,
        user: "usr-admin" // mock admin
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle attachments
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    const fileObj = filesList[0];
    try {
      await addAttachment({
        name: fileObj.name,
        size: `${Math.round(fileObj.size / 1024)} KB`,
        type: fileObj.name.split(".").pop() || "bin",
        url: "#",
        uploadedBy: "Alex Rivera"
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Status modifier helper dropdown
  const handleStatusShift = async (newStatus: any) => {
    try {
      await updateTask({ status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Navigation Title details row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/tasks")}
            className="p-2 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono p-0.5 px-2 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 font-black rounded">
                {task.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-wider">
                {task.title}
              </h1>
            </div>
            <p className="text-xs text-slate-401 mt-0.5 uppercase font-mono tracking-widest leading-none flex items-center gap-1">
              <span>Allocated Portfolio Subsystem:</span>
              <span 
                onClick={() => navigate(`/projects/${task.projectId}`)}
                className="text-[#3b82f6] hover:underline cursor-pointer font-bold flex items-center gap-0.5"
              >
                {task.projectName} ({task.projectKey})
                <ExternalLink size={9} />
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Status controller dropdown */}
          <div className="bg-slate-950/40 p-1 rounded-xl border border-slate-900 flex items-center gap-1 select-none">
            <span className="text-[9px] font-mono text-slate-501 uppercase font-bold pl-1.5 pr-1 font-mono tracking-wider">State:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusShift(e.target.value)}
              className="bg-[#03060c] border border-slate-900 rounded-lg p-1 px-2 text-[10px] text-slate-300 font-mono focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="Todo">Backlog Queue</option>
              <option value="In Progress">Active Handshake</option>
              <option value="Review">Audit Review</option>
              <option value="Done">Finished Ops</option>
            </select>
          </div>

          <button
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
            className="p-2.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-705 text-slate-302 hover:text-white text-[10px] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer rounded-xl transition-all"
          >
            <Edit3 size={12} />
            REWRITE TASK
          </button>
        </div>
      </div>

      {/* Detail Tab selectors link */}
      <div className="flex items-center gap-1 pb-px border-b border-slate-900 overflow-x-auto select-none font-mono text-[10px]">
        {[
          { id: "description", label: "REQUIREMENT DETAIL", icon: <Info size={13} /> },
          { id: "comments", label: `DISCUSSION (${task.comments.length})`, icon: <MessageSquare size={13} /> },
          { id: "attachments", label: `FILE RECLAIM (${task.attachments.length})`, icon: <Paperclip size={13} /> },
          { id: "history", label: "CHRONOLOGY LOGS", icon: <History size={13} /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-3 px-4 font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
                isActive 
                  ? "border-[#5f5bf6] text-[#60a5fa]" 
                  : "border-transparent text-slate-455 hover:text-slate-200 hover:border-slate-800"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab panel */}
      <div className="mt-6">
        {/* ================= DESCRIPTION TAB ================= */}
        {activeTab === "description" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Scope guidelines block */}
              <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-xs font-mono text-[#3b82f6] uppercase tracking-widest font-black mb-3.5">
                  [SPECIFICATIONS & CRITICAL CRITERIA]
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {task.description}
                </p>

                {/* Applied Tags label list */}
                {task.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-6 pt-4 border-t border-slate-900/60">
                    {task.labels.map((lbl) => (
                      <span
                        key={lbl}
                        className="px-2 py-0.5 rounded bg-slate-955 border border-slate-901 text-slate-455 font-mono text-[9px] font-bold text-indigo-400"
                      >
                        #{lbl.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar metadata specifications */}
            <div className="space-y-6">
              <div className="bg-[#090e1a]/85 border border-slate-900 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-xs font-mono text-slate-450 uppercase tracking-widest font-black border-b border-slate-900 pb-2.5">
                  [AUDITING CONSTANTS]
                </h3>

                <div className="space-y-3.5 text-[10px] font-mono">
                  {/* Status */}
                  <div className="flex items-center justify-between border-b border-slate-900/40 pb-2">
                    <span className="text-slate-550 font-bold">DEPLOY STATE:</span>
                    <StatusBadge status={task.status} />
                  </div>

                  {/* Priority */}
                  <div className="flex items-center justify-between border-b border-slate-900/40 pb-2">
                    <span className="text-slate-550 font-bold">PRIORITY CODE:</span>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  {/* EstimatedHours */}
                  <div className="flex items-center justify-between border-b border-slate-900/40 pb-2">
                    <span className="text-slate-550 font-bold">ESTIMATED CYCLE:</span>
                    <span className="text-white font-extrabold flex items-center gap-1 font-mono">
                      <Clock size={11} className="text-indigo-405" />
                      {task.estimatedHours} HOURS
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center justify-between border-b border-slate-900/40 pb-2">
                    <span className="text-slate-550 font-bold">COMPLETION DUE:</span>
                    <span className="text-white font-black flex items-center gap-1 font-mono">
                      <Calendar size={11} className="text-indigo-405" />
                      {task.dueDate}
                    </span>
                  </div>

                  {/* Assigned worker info */}
                  <div className="pt-2">
                    <span className="text-slate-550 block text-[8px] font-black uppercase tracking-wider mb-2.5">ASSIGNED EXPERT ENGINEER</span>
                    {task.assigneeId ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-900">
                        <img
                          src={task.assigneeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                          alt={task.assigneeName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-900"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-extrabold text-white">{task.assigneeName}</div>
                          <div className="text-[10px] text-slate-505 font-mono">UUID: {task.assigneeId}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-955/20 border-2 border-dashed border-slate-900 rounded-xl text-center text-slate-505 text-[10px] uppercase font-bold">
                        Worker allocation pending
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress compliance bar */}
                {task.status !== "Todo" && (
                  <div className="pt-3 border-t border-slate-900/45">
                    <ProgressBar value={task.progress} showText />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= DISCUSSION TAB ================= */}
        {activeTab === "comments" && (
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6 max-w-3xl">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-3">
              Task discussion thread
            </h3>

            {/* Chat list */}
            <div className="space-y-4">
              {task.comments.length === 0 ? (
                <div className="py-8 text-center text-slate-550 font-mono text-xs">NO DISCIPLINE TRAFFIC LOGGED FOR THIS NODE.</div>
              ) : (
                <div className="space-y-4.5">
                  {task.comments.map((com) => (
                    <div
                      key={com.id}
                      className="p-4 rounded-2xl bg-slate-950/30 border border-slate-900 flex gap-3.5 items-start"
                    >
                      <img
                        src={com.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                        alt={com.author}
                        className="w-8 h-8 rounded-full object-cover border border-slate-900 mt-0.5"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-205">{com.author}</span>
                          <span className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">{com.timestamp}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">{com.content}</p>

                        {/* Interactive Emojis reactions */}
                        <div className="flex items-center gap-1.5 pt-2">
                          {["👍", "🎉", "❤️", "👀"].map((emoji) => {
                            const exist = com.reactions?.find((r) => r.emoji === emoji);
                            const active = exist?.users.includes("usr-admin"); // Mock active user
                            return (
                              <button
                                key={emoji}
                                onClick={() => handleReactionClick(com.id, emoji)}
                                className={cn(
                                  "p-1 px-2.5 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer font-bold",
                                  active 
                                    ? "bg-indigo-950/40 border-indigo-500/25 text-indigo-400" 
                                    : "bg-slate-950 border-slate-907 hover:border-slate-800 text-slate-500 hover:text-white"
                                )}
                              >
                                <span>{emoji}</span>
                                {exist && exist.count > 0 && <span>{exist.count}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Send box form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2.5 border-t border-slate-900 pt-4.5">
              <input
                type="text"
                placeholder="Declare thread discussion parameter / append note..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-[#03060c] border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-651 focus:outline-none focus:border-indigo-600 transition-all"
              />
              <button
                type="submit"
                disabled={commentText.trim() === ""}
                className="p-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-505 disabled:opacity-30 disabled:pointer-events-none text-white text-[10px] font-black uppercase font-mono tracking-widest flex items-center gap-1.5 cursor-pointer hover:shadow-lg transition-all"
              >
                <Send size={12} />
                SEND
              </button>
            </form>
          </div>
        )}

        {/* ================= FILE ATTACHMENTS TAB ================= */}
        {activeTab === "attachments" && (
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  Cryptographic Audit File Repository
                </h3>
                <p className="text-xs text-slate-505 mt-1">Version histories, parameters verification backups.</p>
              </div>

              {/* Upload Action btn trigger */}
              <label className="p-2 px-4 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-350 hover:text-white text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer rounded-xl transition-all">
                <Paperclip size={12} />
                ATTACH ASSET
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Attachments list table */}
            {task.attachments.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-900 rounded-xl p-6 text-center text-slate-505 text-xs font-mono">
                NO FILE WORK ATTACHMENTS LINKED FOR THIS SUB-ACTION NODE.
              </div>
            ) : (
              <div className="divide-y divide-slate-900/60 font-mono text-[10px] text-slate-355 select-none">
                {task.attachments.map((file) => (
                  <div key={file.id} className="py-3.5 flex items-center justify-between gap-3 px-3 rounded-xl hover:bg-slate-950/20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 uppercase font-bold text-white">
                        <span>{file.name}</span>
                        <span className="px-1 py-0.5 bg-indigo-950/40 border border-indigo-500/15 text-indigo-400 font-black rounded text-[8px]">
                          v{file.version}.0
                        </span>
                      </div>
                      <div className="text-[9px] tracking-widest text-slate-550 leading-none">
                        UPLOADED BY {file.uploadedBy.toUpperCase()} ({file.uploadedAt.split("T")[0]})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-455 font-bold">{file.size}</span>
                      
                      <button
                        onClick={() => {}}
                        className="p-1.5 rounded-lg border border-slate-900 hover:border-indigo-500 bg-slate-950 text-slate-500 hover:text-white transition-all cursor-pointer"
                        title="Acquire file"
                      >
                        RECALL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= CHRONOLOGY LOGS TAB ================= */}
        {activeTab === "history" && (
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6 max-w-3xl">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-3">
              Chronological Task Shift Log
            </h3>

            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-550 font-mono text-xs">NO AUDIT LOGS FOR THIS ACTIONS NODE.</div>
            ) : (
              <div className="relative border-l border-slate-900 pl-4 ml-2 ml-2.5 space-y-6 text-xs">
                {history.map((hist) => (
                  <div key={hist.id} className="relative">
                    {/* State dot indicator */}
                    <span className="absolute -left-[20.5px] top-1 h-3 w-3 rounded-full bg-slate-950 border-2 border-indigo-500 shadow-[0_0_8px_#5f5bf6]" />

                    <div className="space-y-0.5">
                      <div className="font-mono text-[9px] text-indigo-400 font-black">{hist.timestamp}</div>
                      <div className="font-sans text-slate-201">
                        <span className="font-extrabold text-slate-355">{hist.user}</span>: {hist.action}
                      </div>
                      <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest pt-0.5">
                        Log reference UUID: {hist.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
