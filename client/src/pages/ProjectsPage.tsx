import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Project } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useToast } from '../components/ui/Toast';
import { Folder, PlusCircle, Users, ArrowRight } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest<Project[]>('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    try {
      const created = await apiRequest<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, key, description }),
      });
      toast('Project Created', `Project ${created.name} (${created.key}) added successfully.`, 'success');
      setIsModalOpen(false);
      setName('');
      setKey('');
      setDescription('');
      fetchProjects();
    } catch (err: any) {
      toast('Failed to create project', err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Folder className="w-6 h-6 text-brand-500" />
            Projects Hub ({projects.length})
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage repository projects, keys, team members, and bug statistics.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusCircle className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={180} className="rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Card
              key={proj._id}
              hoverEffect
              onClick={() => navigate(`/projects/${proj._id}`)}
              className="cursor-pointer flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                    {proj.key}
                  </span>
                  <div className="flex -space-x-2">
                    {(proj.members || []).slice(0, 4).map((m) => (
                      <Avatar key={m._id} name={m.name} src={m.avatar} size="xs" />
                    ))}
                  </div>
                </div>

                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white hover:text-brand-500 transition-colors mb-2">
                  {proj.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Owner: {proj.owner?.name}</span>
                <ArrowRight className="w-4 h-4 text-brand-500" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Set up a new project repository key for bug tracking"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name *"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!key) {
                const words = e.target.value.trim().split(' ');
                setKey(words.map((w) => w[0]).join('').substring(0, 4).toUpperCase());
              }
            }}
            placeholder="e.g., Mobile Android App"
            required
          />

          <Input
            label="Project Key (Uppercase Prefix) *"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            placeholder="e.g., MOB"
            maxLength={6}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Project Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Describe the scope of this project repository..."
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
