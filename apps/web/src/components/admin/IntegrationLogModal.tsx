import React, { useState } from 'react';
import { IntegrationLog } from '@avada/shared';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Clock, AlertTriangle } from 'lucide-react';

interface IntegrationLogModalProps {
  log: IntegrationLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationLogModal: React.FC<IntegrationLogModalProps> = ({ log, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'response' | 'request' | 'headers'>('response');

  if (!log) return null;

  const isSuccess = log.responseStatus >= 200 && log.responseStatus < 300;

  const handleCopyPayload = (content: unknown) => {
    const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedResponse =
    log.responsePayload !== null && log.responsePayload !== undefined
      ? JSON.stringify(log.responsePayload, null, 2)
      : 'No response payload recorded';

  const formattedRequest =
    log.requestPayload !== null && log.requestPayload !== undefined
      ? JSON.stringify(log.requestPayload, null, 2)
      : 'No request payload (empty body)';

  const formattedHeaders =
    log.requestHeaders !== null && log.requestHeaders !== undefined
      ? JSON.stringify(log.requestHeaders, null, 2)
      : 'No headers recorded';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-gray-100 [&>button]:text-white/80 [&>button]:hover:text-white [&>button]:top-5 [&>button]:right-5 [&>button]:w-8 [&>button]:h-8 [&>button]:rounded-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:bg-white/10 [&>button]:hover:bg-white/20 [&>button]:transition-all">
        {/* Header */}
        <DialogHeader className="p-6 pr-16 bg-[#2A292D] text-white relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#3BBA93] text-white text-[11px] font-bold px-2 py-0.5">
                {log.method}
              </Badge>
              <Badge
                className={
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold'
                }
              >
                HTTP {log.responseStatus}
              </Badge>
              <span className="flex items-center text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {log.durationMs}ms
              </span>
            </div>

            <span className="text-[11px] text-gray-400">
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>

          <DialogTitle className="text-sm font-mono text-gray-200 mt-3 break-all">
            {log.url}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Integration: <span className="text-[#3BBA93] font-semibold">{log.integrationKey}</span> • Log ID: {log.id}
          </DialogDescription>
        </DialogHeader>

        {/* Error message banner if present */}
        {log.errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error Message:</p>
              <p className="mt-0.5 font-mono">{log.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="px-6 pt-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('response')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'response'
                  ? 'border-[#3BBA93] text-[#3BBA93]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Response Payload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('request')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'request'
                  ? 'border-[#3BBA93] text-[#3BBA93]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Request Payload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('headers')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'headers'
                  ? 'border-[#3BBA93] text-[#3BBA93]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Sanitized Headers
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              handleCopyPayload(
                activeTab === 'response'
                  ? log.responsePayload
                  : activeTab === 'request'
                  ? log.requestPayload
                  : log.requestHeaders
              )
            }
            className="text-[11px] h-7 space-x-1 mb-2 rounded-lg"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Content</span>
              </>
            )}
          </Button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6">
          <div className="bg-[#1E1E24] rounded-lg p-4 font-mono text-xs text-gray-200 overflow-x-auto max-h-[420px] select-text">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {activeTab === 'response' && formattedResponse}
              {activeTab === 'request' && formattedRequest}
              {activeTab === 'headers' && formattedHeaders}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-lg text-xs font-medium"
          >
            Close Inspector
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
