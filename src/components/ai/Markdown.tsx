import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

interface MarkdownProps {
  content: string;
}

/** Parse inline markdown (**bold**, *italic*, `code`) into Text spans. */
function renderInline(
  text: string,
  colors: ReturnType<typeof useTheme>['colors'],
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(
        <Text key={key++} style={styles.bold}>
          {token.slice(2, -2)}
        </Text>,
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <Text
          key={key++}
          style={[styles.code, { backgroundColor: colors.surfaceAlt }]}
        >
          {token.slice(1, -1)}
        </Text>,
      );
    } else if (token.startsWith('*')) {
      nodes.push(
        <Text key={key++} style={styles.italic}>
          {token.slice(1, -1)}
        </Text>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/**
 * Minimal, dependency-free markdown renderer covering the subset LLMs emit:
 * headings, bold/italic/inline-code, bullet & numbered lists, code blocks,
 * blockquotes and horizontal rules.
 */
function MarkdownComponent({ content }: MarkdownProps) {
  const { colors } = useTheme();
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let key = 0;

  const flushCode = () => {
    if (codeBuffer.length) {
      blocks.push(
        <View
          key={key++}
          style={[styles.codeBlock, { backgroundColor: colors.surfaceAlt }]}
        >
          <Text variant="caption" style={styles.codeText}>
            {codeBuffer.join('\n')}
          </Text>
        </View>,
      );
      codeBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.trim().startsWith('```')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(raw);
      continue;
    }

    if (line.trim() === '') continue;

    if (/^---+$/.test(line.trim())) {
      blocks.push(
        <View
          key={key++}
          style={[styles.hr, { backgroundColor: colors.border }]}
        />,
      );
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      blocks.push(
        <Text
          key={key++}
          variant={level === 1 ? 'h3' : level === 2 ? 'title' : 'body'}
          style={styles.heading}
        >
          {renderInline(heading[2]!, colors)}
        </Text>,
      );
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line.trim());
    if (bullet) {
      blocks.push(
        <View key={key++} style={styles.listRow}>
          <Text tone="primary" style={styles.bulletDot}>
            •
          </Text>
          <Text variant="body" style={styles.flex}>
            {renderInline(bullet[1]!, colors)}
          </Text>
        </View>,
      );
      continue;
    }

    const numbered = /^(\d+)\.\s+(.*)$/.exec(line.trim());
    if (numbered) {
      blocks.push(
        <View key={key++} style={styles.listRow}>
          <Text tone="primary" style={styles.bulletDot}>
            {numbered[1]}.
          </Text>
          <Text variant="body" style={styles.flex}>
            {renderInline(numbered[2]!, colors)}
          </Text>
        </View>,
      );
      continue;
    }

    const quote = /^>\s+(.*)$/.exec(line.trim());
    if (quote) {
      blocks.push(
        <View
          key={key++}
          style={[styles.quote, { borderLeftColor: colors.primary }]}
        >
          <Text variant="body" tone="muted">
            {renderInline(quote[1]!, colors)}
          </Text>
        </View>,
      );
      continue;
    }

    blocks.push(
      <Text key={key++} variant="body" style={styles.paragraph}>
        {renderInline(line, colors)}
      </Text>,
    );
  }
  flushCode();

  return <View style={styles.container}>{blocks}</View>;
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  paragraph: { lineHeight: 22 },
  heading: { marginTop: 6, marginBottom: 2 },
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },
  code: {
    fontFamily: 'monospace',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 13,
  },
  codeBlock: { padding: 12, borderRadius: 12, marginVertical: 4 },
  codeText: { fontFamily: 'monospace' },
  listRow: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  bulletDot: { width: 18, fontWeight: '700' },
  flex: { flex: 1, lineHeight: 22 },
  hr: { height: 1, marginVertical: 8 },
  quote: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 4,
  },
});

export const Markdown = memo(MarkdownComponent);
