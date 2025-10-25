/**
 * Editor State Model
 *
 * Types for Lexical editor state structure
 */

export interface EditorState {
  root: {
    children: any[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}
