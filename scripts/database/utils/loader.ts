export class Loader {
  private frames: string[];
  private interval: NodeJS.Timeout | null = null;
  private currentFrame: number = 0;
  private text: string;
  private stopped: boolean = true;
  private cursorHidden: boolean = false;

  constructor(
    text: string,
    frames: string[] = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
  ) {
    this.frames = frames;
    this.text = text;

    // Set up process-wide error handlers to restore cursor
    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.restoreCursor();
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.restoreCursor();
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // Handle normal termination
    process.on('exit', () => {
      this.restoreCursor();
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      this.restoreCursor();
      process.exit(0);
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      this.restoreCursor();
      process.exit(0);
    });
  }

  private restoreCursor(): void {
    if (this.cursorHidden) {
      try {
        process.stdout.write('\x1B[?25h'); // Show cursor
        this.cursorHidden = false;
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  }

  start(): void {
    if (!this.stopped) return;
    this.stopped = false;

    try {
      process.stdout.write('\x1B[?25l'); // Hide cursor
      this.cursorHidden = true;
      this.render();
      this.interval = setInterval(() => {
        this.render();
      }, 80);
    } catch (error) {
      this.restoreCursor();
      console.error('Error starting loader:', error);
    }
  }

  stop(finalEmoji?: string, finalText?: string): void {
    if (this.stopped) return;
    this.stopped = true;

    try {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);

      if (finalEmoji && finalText) {
        console.log(`${finalEmoji} ${finalText}`);
      }

      this.restoreCursor();
    } catch (error) {
      this.restoreCursor();
      console.error('Error stopping loader:', error);
    }
  }

  private render(): void {
    try {
      const frame = this.frames[this.currentFrame];
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${frame} ${this.text}`);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    } catch (error) {
      this.stop();
      console.error('Error rendering loader:', error);
    }
  }

  setText(text: string): void {
    this.text = text;
  }
}
