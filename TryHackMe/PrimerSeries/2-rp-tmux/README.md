# RP-tmux

[rp-tmux](https://tryhackme.com/room/rptmux)

## Summary

1. tmux Hotkeys and Bindings

   ![tmux bindings](./tmux.png)

2. tmux sessions

   1. `tmux new -s sessionName` - new session
   2. `tmux a -t sessionName` - attach session
   3. `tmux kill-session -t sessionName` - kill session
   4. `tmux d` - detach session
   5. `tmux ls` - list all sessions
   6. `ctrl-B-$` - rename session
   7. `ctrl-B-D` - detach session
   8. `ctrl-B-)` - next session
   9. `ctrl-B-(` - prev session

3. tmux windows / tabs

   1. `ctrl-B-C` - new window
   2. `ctrl-B-N` - next window
   3. `ctrl-B-P` - previous window
   4. `ctrl-B-L` - last used window
   5. `ctrl-B-[0-9]` - window 0-9
   6. `ctrl-B-'` - select window by name
   7. `ctrl-B-.` - change window number
   8. `ctrl-B-F` - search window
   9. `ctrl-B-&` - kill window
   10. `ctrl-B-W` - list window

4. tmux panes

   1. `ctrl-B-%` - vertical split
   2. `ctrl-B-"` - horizontal split
   3. `ctrl-B-→` - move to pane to the right
   4. `ctrl-B-←` - move to pane to the left
   5. `ctrl-B-↑` - move up to pane
   6. `ctrl-B-↓` - move down to pane
   7. `ctrl-B-O` - go to next pane
   8. `ctrl-B-;` - go to last active pane
   9. `ctrl-B-}` - move pane to right
   10. `ctrl-B-{` - move pane to left
   11. `ctrl-B-!` - convert pane to window
   12. `ctrl-B-X` - kill pane

5. tmux copy mode

   1. `ctrl-B-[` - start copy mode
   2. `ctrl-B-]` - paste from buffer
   3. `Space` - start selection
   4. `Enter` - copy selection
   5. `Esc` - clear selection
   6. `g` - go to top
   7. `G` - go to bottom
   8. `h` - move cursor left
   9. `j` - move cursor down
   10. `k` - move cursor up
   11. `l` - move cursor right
   12. `/` - search regex
   13. `#` - list paste buffers
   14. `q` - quit

## Solutions

1. Screens wishes it was this tool

   1. Complete
   2. `tmux`
   3. `control`
   4. `b`
   5. `d`
   6. `tmux ls`
   7. `0`
   8. `tmux a -t 0`
   9. `c`
   10. Deploy and Complete
   11. `nmap -sV -vv -sC IP`
   12. `[`
   13. `g`
   14. `G`
   15. `q`
   16. `%`
   17. `"`
   18. `ctrl-B-←/→`
   19. `ctrl-B-0`
   20. `x`
   21. `exit`
   22. `tmux new -s neat`
