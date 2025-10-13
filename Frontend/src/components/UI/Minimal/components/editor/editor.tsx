import { common, createLowlight } from 'lowlight';
import LinkExtension from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import StarterKitExtension from '@tiptap/starter-kit';
import TextAlignExtension from '@tiptap/extension-text-align';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import { useState, useEffect, forwardRef, useCallback } from 'react';
import CodeBlockLowlightExtension from '@tiptap/extension-code-block-lowlight';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';

import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import FormHelperText from '@mui/material/FormHelperText';
import * as CONFIG from '@/config';
import { Toolbar } from './toolbar';
import { StyledRoot } from './styles';
import { editorClasses } from './classes';
import { CodeHighlightBlock } from './components/code-highlight-block';

import type { EditorProps } from './types';
import AttachmentService from '../../services/AttachmentService';

// ----------------------------------------------------------------------

export const Editor = forwardRef<HTMLDivElement, EditorProps>(
  (
    {
      sx,
      error,
      onChange,
      slotProps,
      helperText,
      resetValue,
      className,
      editable = true,
      fullItem = false,
      value: content = '',
      placeholder = '',
      ...other
    },
    ref
  ) => {
    const [fullScreen, setFullScreen] = useState(false);

    const handleToggleFullScreen = useCallback(() => {
      setFullScreen((prev) => !prev);
    }, []);

    const lowlight = createLowlight(common);

    const editor = useEditor({
      content,
      editable,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      extensions: [
        Underline,
        StarterKitExtension.configure({
          codeBlock: false,
          code: { HTMLAttributes: { class: editorClasses.content.codeInline } },
          heading: { HTMLAttributes: { class: editorClasses.content.heading } },
          horizontalRule: { HTMLAttributes: { class: editorClasses.content.hr } },
          listItem: { HTMLAttributes: { class: editorClasses.content.listItem } },
          blockquote: { HTMLAttributes: { class: editorClasses.content.blockquote } },
          bulletList: { HTMLAttributes: { class: editorClasses.content.bulletList } },
          orderedList: { HTMLAttributes: { class: editorClasses.content.orderedList } },
        }),
        PlaceholderExtension.configure({
          placeholder,
          emptyEditorClass: editorClasses.content.placeholder,
        }),
        ImageExtension.configure({ HTMLAttributes: { class: editorClasses.content.image } }),
        TextAlignExtension.configure({ types: ['heading', 'paragraph'] }),
        LinkExtension.configure({
          autolink: true,
          openOnClick: false,
          HTMLAttributes: { class: editorClasses.content.link },
        }),
        CodeBlockLowlightExtension.extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeHighlightBlock as any);
          },
        }).configure({ lowlight, HTMLAttributes: { class: editorClasses.content.codeBlock } }),
      ],
      onUpdate({ editor: _editor }) {
        const html = _editor.getHTML();
        onChange?.(html);
      },
      ...other,
    });

    useEffect(() => {
      const timer = setTimeout(() => {
        if (editor?.isEmpty && content !== '<p></p>') {
          editor.commands.setContent(content);
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [content, editor]);

    useEffect(() => {
      if (resetValue && !content) {
        editor?.commands.clearContent();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    useEffect(() => {
      if (fullScreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }, [fullScreen]);

    const handleAddImage = async () => {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB 제한
            if (file.size > MAX_SIZE) {
              alert('파일 크기는 5MB 이하여야 합니다.');
              return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await AttachmentService.addAttachment(formData);
            if (response.filename === '') {
              alert('이미지 업로드에 실패했습니다.');
              return;
            }
            
            // 업로드 완료되면 에디터에 이미지 추가
            editor?.chain().focus().setImage({ src: `${import.meta.env.VITE_SERVER_URL}/${response.path.replace(/\\/g, '/')}` }).run();
          }
        };

        input.click();
      } catch (err) {
        console.error('error:', error);
      }
    };
    
    return (
      <Portal disablePortal={!fullScreen}>
        {fullScreen && <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }} />}

        <Stack sx={{ ...(!editable && { cursor: 'not-allowed' }), ...slotProps?.wrap }}>
          <StyledRoot
            error={!!error}
            disabled={!editable}
            fullScreen={fullScreen}
            className={editorClasses.root.concat(className ? ` ${className}` : '')}
            sx={sx}
          >
            <Toolbar
              editor={editor}
              fullItem={fullItem}
              fullScreen={fullScreen}
              onToggleFullScreen={handleToggleFullScreen}
              onAddImage={handleAddImage}
            />
            <EditorContent
              ref={ref}
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              editor={editor}
              className={editorClasses.content.root}
            />
          </StyledRoot>

          {helperText && (
            <FormHelperText error={!!error} sx={{ px: 2 }}>
              {helperText}
            </FormHelperText>
          )}
        </Stack>
      </Portal>
    );
  }
);
