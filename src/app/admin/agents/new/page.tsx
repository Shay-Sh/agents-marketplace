'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPicker } from "@/components/admin/icon-picker";
import { 
  Bot, 
  ArrowLeft,
  Save,
  Eye,
  DollarSign,
  Tag,
  Webhook,
  Type,
  FileText,
  Palette
} from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    pricing_tier: 'free',
    context_type: 'hybrid',
    system_prompt: '',
    icon: 'Bot',
    webhook_url: '',
    keywords: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        }),
      });
      
      if (response.ok) {
        // Redirect to agents list or show success
        window.location.href = '/admin/agents';
      } else {
        alert('Failed to create agent');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Error creating agent');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/agents">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Create New Agent</h1>
          <p className="text-gray-400">
            Add a new AI agent to the marketplace
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Type className="h-5 w-5 text-white" />
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Essential details about the agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Agent Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Customer Support AI"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="e.g., Customer Service"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what this agent does and its capabilities..."
                    className="min-h-[100px] bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-white">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    placeholder="customer service, support, chat, help (comma separated)"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400">Separate multiple keywords with commas</p>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-white" />
                  <CardTitle className="text-white">Agent Configuration</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Technical settings and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pricing_tier" className="text-white">Pricing Tier</Label>
                    <Select value={formData.pricing_tier} onValueChange={(value) => handleInputChange('pricing_tier', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="context_type" className="text-white">Context Type</Label>
                    <Select value={formData.context_type} onValueChange={(value) => handleInputChange('context_type', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="user_provided">User Provided</SelectItem>
                        <SelectItem value="predefined">Predefined</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook_url" className="text-white">Webhook URL</Label>
                  <Input
                    id="webhook_url"
                    type="url"
                    value={formData.webhook_url}
                    onChange={(e) => handleInputChange('webhook_url', e.target.value)}
                    placeholder="https://api.example.com/webhook"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400">Optional webhook endpoint for agent interactions</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system_prompt" className="text-white">System Prompt</Label>
                  <Textarea
                    id="system_prompt"
                    value={formData.system_prompt}
                    onChange={(e) => handleInputChange('system_prompt', e.target.value)}
                    placeholder="You are a helpful AI assistant that..."
                    className="min-h-[120px] bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-400">Define the agent&apos;s behavior and personality</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Icon Picker */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-white" />
                  <CardTitle className="text-white">Agent Icon</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Choose an icon to represent this agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IconPicker
                  selectedIcon={formData.icon}
                  onIconSelect={(icon) => handleInputChange('icon', icon)}
                />
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-white" />
                  <CardTitle className="text-white">Preview</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{formData.name || 'Agent Name'}</h3>
                      <Badge variant="outline" className="text-xs">
                        {formData.category || 'Category'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {formData.description || 'Agent description will appear here...'}
                  </p>
                  <Badge variant={formData.pricing_tier === 'free' ? 'secondary' : 'default'}>
                    {formData.pricing_tier}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button 
                type="submit" 
                disabled={loading || !formData.name || !formData.description}
                className="w-full bg-white text-gray-900 hover:bg-gray-100"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Creating Agent...' : 'Create Agent'}
              </Button>
              <Button variant="outline" type="button" className="w-full" asChild>
                <Link href="/admin/agents">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}