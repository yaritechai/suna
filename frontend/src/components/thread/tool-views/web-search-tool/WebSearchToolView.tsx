import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Image as ImageIcon,
  Globe,
  FileText,
  Clock,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ToolViewProps } from '../types';
import { cleanUrl, formatTimestamp, getToolTitle } from '../utils';
import { cn, truncateString } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LoadingState } from '../shared/LoadingState';
import { extractWebSearchData } from './_utils';

export function WebSearchToolView({
  name = 'web-search',
  assistantContent,
  toolContent,
  assistantTimestamp,
  toolTimestamp,
  isSuccess = true,
  isStreaming = false,
}: ToolViewProps) {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';
  const [expandedResults, setExpandedResults] = useState<Record<number, boolean>>({});

  const {
    query,
    searchResults,
    answer,
    images,
    actualIsSuccess,
    actualToolTimestamp,
    actualAssistantTimestamp
  } = extractWebSearchData(
    assistantContent,
    toolContent,
    isSuccess,
    toolTimestamp,
    assistantTimestamp
  );

  const toolTitle = getToolTitle(name);

  const toggleExpand = (idx: number) => {
    setExpandedResults(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      return null;
    }
  };

  const getResultType = (result: any) => {
    const { url, title } = result;

    if (url.includes('news') || url.includes('article') || title.includes('News')) {
      return { icon: FileText, label: 'Article' };
    } else if (url.includes('wiki')) {
      return { icon: BookOpen, label: 'Wiki' };
    } else if (url.includes('blog')) {
      return { icon: CalendarDays, label: 'Blog' };
    } else {
      return { icon: Globe, label: 'Website' };
    }
  };

  return (
    <Card className="gap-0 flex border shadow-none border-t border-b-0 border-x-0 p-0 rounded-none flex-col h-full overflow-hidden bg-base-100">
      <CardHeader className="h-14 bg-base-200/80 backdrop-blur-sm border-b border-base-300/50 p-2 px-4 space-y-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-sm">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium text-base-content">
                {toolTitle}
              </CardTitle>
            </div>
          </div>

          {!isStreaming && (
            <Badge
              variant="secondary"
              className={
                actualIsSuccess
                  ? "bg-success/20 text-success border-success/30 hover:bg-success/30"
                  : "bg-error/20 text-error border-error/30 hover:bg-error/30"
              }
            >
              {actualIsSuccess ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {actualIsSuccess ? 'Search completed successfully' : 'Search failed'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full flex-1 overflow-hidden relative">
        {isStreaming && searchResults.length === 0 && !answer ? (
          <LoadingState
            icon={Search}
            iconColor="text-primary"
            bgColor="bg-gradient-to-b from-primary/10 to-primary/5 shadow-inner"
            title="Searching the web"
            filePath={query}
            showProgress={true}
          />
        ) : searchResults.length > 0 || answer ? (
          <ScrollArea className="h-full w-full">
            <div className="p-4 py-0 my-4">
              {images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-base-content/80 mb-3 flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2 opacity-70" />
                    Images
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-1">
                    {images.slice(0, 6).map((image, idx) => (
                      <a
                        key={idx}
                        href={image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-lg border border-base-300 bg-base-200 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.02]"
                      >
                        <img
                          src={image}
                          alt={`Search result ${idx + 1}`}
                          className="object-cover w-full h-32 group-hover:opacity-90 transition-opacity"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                            target.classList.add("p-4");
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-base-100/90 hover:bg-base-100 text-base-content border border-base-300/50 shadow-sm backdrop-blur-sm">
                            <ExternalLink className="h-3 w-3" />
                          </Badge>
                        </div>
                      </a>
                    ))}
                  </div>
                  {images.length > 6 && (
                    <Button variant="outline" size="sm" className="mt-2 text-xs border-base-300 hover:bg-base-200">
                      View {images.length - 6} more images
                    </Button>
                  )}
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="text-base font-semibold text-base-content mb-6 flex items-center justify-between">
                  <span>Search Results ({searchResults.length})</span>
                  <Badge variant="outline" className="text-xs font-medium border-primary/30 bg-primary/10 text-primary">
                    <Clock className="h-3 w-3 mr-1.5" />
                    {new Date().toLocaleDateString()}
                  </Badge>
                </div>
              )}

              <div className="space-y-5">
                {searchResults.map((result, idx) => {
                  const { icon: ResultTypeIcon, label: resultTypeLabel } = getResultType(result);
                  const isExpanded = expandedResults[idx] || false;
                  const favicon = getFavicon(result.url);

                  return (
                    <div
                      key={idx}
                      className="bg-base-300/60 border border-base-300/40 rounded-xl shadow-sm hover:shadow-lg hover:border-primary/40 hover:bg-base-300/80 transition-all duration-300 group backdrop-blur-sm"
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base font-semibold text-base-content hover:text-primary hover:underline line-clamp-2 transition-colors leading-snug group-hover:text-primary flex-1"
                              >
                                {truncateString(cleanUrl(result.title), 60)}
                              </a>
                              <Badge variant="outline" className="text-xs px-2.5 py-1 h-6 font-medium bg-primary/10 border-primary/30 text-primary flex-shrink-0">
                                <ResultTypeIcon className="h-3 w-3 mr-1.5" />
                                {resultTypeLabel}
                              </Badge>
                            </div>
                            <div className="text-sm text-base-content/70 mb-1 flex items-center bg-base-100/60 rounded-lg px-3 py-2 border border-base-300/30">
                              {favicon ? (
                                <img
                                  src={favicon}
                                  alt=""
                                  className="w-4 h-4 mr-2 flex-shrink-0 object-contain rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Globe className="h-4 w-4 mr-2 flex-shrink-0 text-primary/60" />
                              )}
                              <span className="truncate">{truncateString(cleanUrl(result.url), 65)}</span>
                            </div>
                          </div>
                          {/* <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full"
                                  onClick={() => toggleExpand(idx)}
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{isExpanded ? 'Show less' : 'Show more'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider> */}
                        </div>

                        {/* {result.snippet && (
                          <div className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-400",
                            isExpanded ? "whitespace-pre-wrap break-words max-h-96 overflow-y-auto" : "line-clamp-2"
                          )}>
                            {isExpanded ? (
                              // When expanded, preserve line breaks and show full content
                              result.snippet
                                ?.replace(/\\\\\n/g, '\n')
                                ?.replace(/\\\\n/g, '\n')
                                ?.replace(/\\n/g, '\n')
                                ?.replace(/\\\\\t/g, '\t')
                                ?.replace(/\\\\t/g, '\t')
                                ?.replace(/\\t/g, '\t')
                                ?.replace(/\\\\\r/g, '\r')
                                ?.replace(/\\\\r/g, '\r')
                                ?.replace(/\\r/g, '\r')
                                ?.trim()
                            ) : (
                              // When collapsed, convert to single line
                              result.snippet
                                ?.replace(/\\\\\n/g, ' ')
                                ?.replace(/\\\\n/g, ' ')
                                ?.replace(/\\n/g, ' ')
                                ?.replace(/\\\\\t/g, ' ')
                                ?.replace(/\\\\t/g, ' ')
                                ?.replace(/\\t/g, ' ')
                                ?.replace(/\\\\\r/g, ' ')
                                ?.replace(/\\\\r/g, ' ')
                                ?.replace(/\\r/g, ' ')
                                ?.replace(/\s+/g, ' ')
                                ?.trim()
                            )}
                          </div>
                        )} */}
                      </div>

                      {isExpanded && (
                        <div className="bg-base-100/40 px-5 border-t border-base-300/40 py-4 flex justify-between items-center">
                          <div className="text-sm text-base-content/70 font-medium">
                            Source: {cleanUrl(result.url)}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-sm bg-primary/5 border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-primary font-medium"
                            asChild
                          >
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1.5" />
                              Visit Site
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 px-6 bg-gradient-to-b from-base-100 to-base-200/50">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-b from-base-200/80 to-base-300/60 shadow-inner border border-base-300/30">
              <Search className="h-10 w-10 text-base-content/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-base-content">
              No Results Found
            </h3>
            <div className="bg-base-200/60 border border-base-300/60 rounded-lg p-4 w-full max-w-md text-center mb-4 shadow-sm">
              <code className="text-sm font-mono text-base-content/80 break-all">
                {query || 'Unknown query'}
              </code>
            </div>
            <p className="text-sm text-base-content/60">
              Try refining your search query for better results
            </p>
          </div>
        )}
      </CardContent>

      <div className="px-4 py-2 h-10 bg-gradient-to-r from-base-200/90 to-base-300/60 backdrop-blur-sm border-t border-base-300/50 flex justify-between items-center gap-4">
        <div className="h-full flex items-center gap-2 text-sm text-base-content/70">
          {!isStreaming && searchResults.length > 0 && (
            <Badge variant="outline" className="h-6 py-0.5 border-base-300 bg-base-100/60 text-base-content/70">
              <Globe className="h-3 w-3" />
              {searchResults.length} results
            </Badge>
          )}
        </div>

        <div className="text-xs text-base-content/60">
          {actualToolTimestamp && !isStreaming
            ? formatTimestamp(actualToolTimestamp)
            : actualAssistantTimestamp
              ? formatTimestamp(actualAssistantTimestamp)
              : ''}
        </div>
      </div>
    </Card>
  );
} 