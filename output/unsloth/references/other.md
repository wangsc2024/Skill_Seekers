# Unsloth - Other

**Pages:** 35

---

## (3) Adding an evaluation loop / OOMs

**URL:** llms-txt#(3)-adding-an-evaluation-loop-/-ooms

---

## Accept licenses

**URL:** llms-txt#accept-licenses

yes | sdkmanager --licenses

---

## AMD

**URL:** llms-txt#amd

**Contents:**
  - :1234:Reinforcement Learning on AMD GPUs
  - :tools:Troubleshooting
  - :books:AMD Free One-click notebooks

Guide for Fine-tuning LLMs with Unsloth on AMD GPUs.

Unsloth supports AMD Radeon RX, MI300X's (192GB) GPUs and more.

{% stepper %}
{% step %}
**Make a new isolated environment (Optional)**

To not break any system packages, you can make an isolated pip environment. Reminder to check what Python version you have! It might be `pip3`, `pip3.13`, `python3`, `python.3.13` etc.

{% code overflow="wrap" %}

{% endcode %}
{% endstep %}

{% step %}
**Install PyTorch**

Install the latest PyTorch, TorchAO, Xformers from <https://pytorch.org/>

{% code overflow="wrap" %}

{% endcode %}
{% endstep %}

{% step %}
**Install Unsloth**

Install Unsloth's dedicated AMD branch

{% code overflow="wrap" %}

{% endcode %}
{% endstep %}
{% endstepper %}

And that's it! Try some examples in our [**Unsloth Notebooks**](https://docs.unsloth.ai/get-started/unsloth-notebooks) page!

### :1234:Reinforcement Learning on AMD GPUs

You can use our :ledger:[gpt-oss RL auto win 2048](https://github.com/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_Reinforcement_Learning_2048_Game_BF16.ipynb) example on a MI300X (192GB) GPU. The goal is to play the 2048 game automatically and win it with RL. The LLM (gpt-oss 20b) auto devises a strategy to win the 2048 game, and we calculate a high reward for winning strategies, and low rewards for failing strategies.

{% columns %}
{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-2bc5a2e25a51781fd945ab9e87e73821ed4eb6c9%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column %}
The reward over time is increasing after around 300 steps or so!

The goal for RL is to maximize the average reward to win the 2048 game.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-8d7ea897fd57156a796e4f74aa2e3b60afe9d405%2F2048%20Auto%20Win%20Game%20Reward.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

We used an AMD MI300X machine (192GB) to run the 2048 RL example with Unsloth, and it worked well!

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-174890aa5f63632ebe6f3f212f1ced0d0e8dc381%2FScreenshot%202025-10-17%20052504.png?alt=media" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f907ba596705496515fdfb39b49d649697317ca7%2FScreenshot%202025-10-17%20052641.png?alt=media" alt=""><figcaption></figcaption></figure></div>

You can also use our :ledger:[automatic kernel gen RL notebook](https://github.com/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_GRPO_BF16.ipynb) also with gpt-oss to auto create matrix multiplication kernels in Python. The notebook also devices multiple methods to counteract reward hacking.

{% columns %}
{% column width="50%" %}
The prompt we used to auto create these kernels was:

{% code overflow="wrap" %}

python
def matmul(A, B):
    return ...
`

{% endcode %}
{% endcolumn %}

{% column width="50%" %}
The RL process learns for example how to apply the Strassen algorithm for faster matrix multiplication inside of Python.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ddb993e5d2c986794ede1f2b0d08897469b78506%2Fimage%20(1)%20(1)%20(1)%20(1)%20(1)%20(1).png?alt=media" alt="" width="375"><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### :tools:Troubleshooting

**As of October 2025, bitsandbytes in AMD is under development** - you might get `HSA_STATUS_ERROR_EXCEPTION: An HSAIL operation resulted in a hardware exception` errors. We disabled bitsandbytes internally in Unsloth automatically until a fix is provided for versions `0.48.2.dev0` and above. This means `load_in_4bit = True` will instead use 16bit LoRA. Full finetuning also works via `full_finetuning = True`

To force 4bit, you need to specify the actual model name like `unsloth/gemma-3-4b-it-unsloth-bnb-4bit` and set `use_exact_model_name = True` as an extra argument within `FastLanguageModel.from_pretrained` etc.

AMD GPUs also need the bitsandbytes `blocksize` to be 128 and not 64 - this also means our pre-quantized models (for example [unsloth/Llama-3.2-1B-Instruct-unsloth-bnb-4bit](https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-bnb-4bit)) from [HuggingFace](https://huggingface.co/unsloth) for now will not work - we auto switch to downloading the full BF16 weights, then quantize on the fly if we detect an AMD GPU.

### :books:AMD Free One-click notebooks

AMD provides one-click notebooks equipped with **free 192GB VRAM MI300X GPUs** through their Dev Cloud. Train large models completely for free (no signup or credit card required):

* [Qwen3 (32B)](https://oneclickamd.ai/github/unslothai/notebooks/blob/main/nb/Qwen3_\(32B\)_A100-Reasoning-Conversational.ipynb)
* [Llama 3.3 (70B)](https://oneclickamd.ai/github/unslothai/notebooks/blob/main/nb/Llama3.3_\(70B\)_A100-Conversational.ipynb)
* [Qwen3 (14B)](http://oneclickamd.ai/github/unslothai/notebooks/blob/main/nb/Qwen3_\(14B\)-Reasoning-Conversational.ipynb)
* [Mistral v0.3 (7B)](http://oneclickamd.ai/github/unslothai/notebooks/blob/main/nb/Mistral_v0.3_\(7B\)-Alpaca.ipynb)
* [GPT OSS MXFP4 (20B)](http://oneclickamd.ai/github/unslothai/notebooks/blob/main/nb/Kaggle-GPT_OSS_MXFP4_\(20B\)-Inference.ipynb) - Inference

You can use any Unsloth notebook by prepending ***<https://oneclickamd.ai/github/unslothai/notebooks/blob/main/nb>*** in [unsloth-notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks "mention") by changing the link from <https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma3_(270M).ipynb> to <https://oneclickamd.ai/github/unslothai/notebooks/blob/main/nb/Gemma3_(270M).ipynb>

{% columns %}
{% column width="33.33333333333333%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2F7NNi4jLKvmZoRnLel9Kg%2Fimage.png?alt=media&#x26;token=0379eda9-569c-4614-afb5-ffec463a7676" alt=""><figcaption></figcaption></figure>
{% endcolumn %}

{% column width="66.66666666666667%" %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FRfKS1GAW7BqL9lGNTcxh%2Fimage.png?alt=media&#x26;token=3a8aeb01-62a7-4d55-89a9-98526052e305" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

**Examples:**

Example 1 (bash):
```bash
apt install python3.10-venv python3.11-venv python3.12-venv python3.13-venv -y

python -m venv unsloth_env
source unsloth_env/bin/activate
```

Example 2 (bash):
```bash
pip install --upgrade torch==2.8.0 pytorch-triton-rocm torchvision torchaudio torchao==0.13.0 xformers --index-url https://download.pytorch.org/whl/rocm6.4
```

Example 3 (bash):
```bash
pip install --no-deps unsloth unsloth-zoo
pip install --no-deps git+https://github.com/unslothai/unsloth-zoo.git
pip install "unsloth[amd] @ git+https://github.com/unslothai/unsloth"
```

Example 4 (unknown):
```unknown
Create a new fast matrix multiplication function using only native Python code.
You are given a list of list of numbers.
Output your new function in backticks using the format below:
```

---

## Colors

**URL:** llms-txt#colors

pipe_colors = [(0, 100, 0), (210, 180, 140), (50, 50, 50)]
land_colors = [(139, 69, 19), (255, 255, 0)]

---

## Colors for the balls

**URL:** llms-txt#colors-for-the-balls

**Contents:**
- :detective: Extra Findings & Tips

BALL_COLORS = [
    '#f8b862', '#f6ad49', '#f39800', '#f08300', '#ec6d51',
    '#ee7948', '#ed6d3d', '#ec6800', '#ec6800', '#ee7800',
    '#eb6238', '#ea5506', '#ea5506', '#eb6101', '#e49e61',
    '#e45e32', '#e17b34', '#dd7a56', '#db8449', '#d66a35'
]

@dataclass
class Ball:
    x: float
    y: float
    vx: float
    vy: float
    radius: float
    color: str
    number: int
    spin: float = 0.0

def move(self):
        self.x += self.vx
        self.y += self.vy
        self.vy += GRAVITY
        self.vx *= FRICTION
        self.vy *= FRICTION
        self.spin *= SPIN_FRICTION

def collide_with_ball(self, other: 'Ball'):
        dx = other.x - self.x
        dy = other.y - self.y
        distance = math.hypot(dx, dy)
        
        if distance < self.radius + other.radius:
            # Calculate collision normal
            nx = dx / distance
            ny = dy / distance
            
            # Calculate relative velocity
            dvx = other.vx - self.vx
            dvy = other.vy - self.vy
            
            # Calculate impulse
            impulse = 2 * (dvx * nx + dvy * ny) / (1/self.radius + 1/other.radius)
            
            # Apply impulse
            self.vx += impulse * nx / self.radius
            self.vy += impulse * ny / self.radius
            other.vx -= impulse * nx / other.radius
            other.vy -= impulse * ny / other.radius
            
            # Separate balls to prevent sticking
            overlap = (self.radius + other.radius - distance) / 2
            self.x -= overlap * nx
            self.y -= overlap * ny
            other.x += overlap * nx
            other.y += overlap * ny
            
            # Transfer some spin
            transfer = impulse * 0.01
            self.spin -= transfer
            other.spin += transfer

class HeptagonBounceSimulator:
    def __init__(self, root):
        self.root = root
        self.canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg='white')
        self.canvas.pack()
        
        self.balls = self.create_balls()
        self.heptagon_angle = 0
        self.last_time = 0
        self.running = True
        
        self.root.bind('<space>', self.toggle_pause)
        self.root.bind('<Escape>', lambda e: root.destroy())
        
        self.last_time = self.root.after(0, self.update)
    
    def create_balls(self) -> List[Ball]:
        balls = []
        for i in range(20):
            # Start all balls at center with small random velocity
            angle = np.random.uniform(0, 2 * math.pi)
            speed = np.random.uniform(0.5, 2)
            vx = math.cos(angle) * speed
            vy = math.sin(angle) * speed
            
            balls.append(Ball(
                x=CENTER_X,
                y=CENTER_Y,
                vx=vx,
                vy=vy,
                radius=BALL_RADIUS,
                color=BALL_COLORS[i],
                number=i+1,
                spin=np.random.uniform(-2, 2)
            ))
        return balls
    
    def toggle_pause(self, event):
        self.running = not self.running
        if self.running:
            self.last_time = self.root.after(0, self.update)
    
    def get_heptagon_vertices(self) -> List[Tuple[float, float]]:
        vertices = []
        for i in range(7):
            angle = math.radians(self.heptagon_angle + i * 360 / 7)
            x = CENTER_X + HEPTAGON_RADIUS * math.cos(angle)
            y = CENTER_Y + HEPTAGON_RADIUS * math.sin(angle)
            vertices.append((x, y))
        return vertices
    
    def check_ball_heptagon_collision(self, ball: Ball):
        vertices = self.get_heptagon_vertices()
        closest_dist = float('inf')
        closest_normal = (0, 0)
        closest_edge = None
        
        # Check collision with each edge of the heptagon
        for i in range(len(vertices)):
            p1 = vertices[i]
            p2 = vertices[(i + 1) % len(vertices)]
            
            # Vector from p1 to p2
            edge_x = p2[0] - p1[0]
            edge_y = p2[1] - p1[1]
            edge_length = math.hypot(edge_x, edge_y)
            
            # Normalize edge vector
            edge_x /= edge_length
            edge_y /= edge_length
            
            # Normal vector (perpendicular to edge, pointing inward)
            nx = -edge_y
            ny = edge_x
            
            # Vector from p1 to ball
            ball_to_p1_x = ball.x - p1[0]
            ball_to_p1_y = ball.y - p1[1]
            
            # Project ball onto edge normal
            projection = ball_to_p1_x * nx + ball_to_p1_y * ny
            
            # If projection is negative, ball is outside the heptagon
            if projection < ball.radius:
                # Find closest point on edge to ball
                edge_proj = ball_to_p1_x * edge_x + ball_to_p1_y * edge_y
                edge_proj = max(0, min(edge_length, edge_proj))
                closest_x = p1[0] + edge_proj * edge_x
                closest_y = p1[1] + edge_proj * edge_y
                
                # Distance from ball to closest point on edge
                dist = math.hypot(ball.x - closest_x, ball.y - closest_y)
                
                if dist < closest_dist:
                    closest_dist = dist
                    closest_normal = (nx, ny)
                    closest_edge = (p1, p2)
        
        if closest_dist < ball.radius:
            # Calculate bounce response
            dot_product = ball.vx * closest_normal[0] + ball.vy * closest_normal[1]
            
            # Apply bounce with elasticity
            ball.vx -= (1 + ELASTICITY) * dot_product * closest_normal[0]
            ball.vy -= (1 + ELASTICITY) * dot_product * closest_normal[1]
            
            # Add some spin based on impact
            edge_vec = (closest_edge[1][0] - closest_edge[0][0], 
                        closest_edge[1][1] - closest_edge[0][1])
            edge_length = math.hypot(edge_vec[0], edge_vec[1])
            if edge_length > 0:
                edge_vec = (edge_vec[0]/edge_length, edge_vec[1]/edge_length)
                # Cross product of velocity and edge direction
                spin_effect = (ball.vx * edge_vec[1] - ball.vy * edge_vec[0]) * 0.1
                ball.spin += spin_effect
            
            # Move ball outside the heptagon to prevent sticking
            penetration = ball.radius - closest_dist
            ball.x += penetration * closest_normal[0]
            ball.y += penetration * closest_normal[1]
    
    def update(self):
        if not self.running:
            return
        
        # Clear canvas
        self.canvas.delete('all')
        
        # Update heptagon rotation
        self.heptagon_angle += ROTATION_SPEED / 60  # Assuming ~60 FPS
        
        # Draw heptagon
        vertices = self.get_heptagon_vertices()
        self.canvas.create_polygon(vertices, outline='black', fill='', width=2)
        
        # Update and draw balls
        for i, ball in enumerate(self.balls):
            # Move ball
            ball.move()
            
            # Check collisions with heptagon
            self.check_ball_heptagon_collision(ball)
            
            # Draw ball
            self.canvas.create_oval(
                ball.x - ball.radius, ball.y - ball.radius,
                ball.x + ball.radius, ball.y + ball.radius,
                fill=ball.color, outline='black'
            )
            
            # Draw number with rotation based on spin
            angle = ball.spin * 10  # Scale spin for visible rotation
            self.canvas.create_text(
                ball.x, ball.y,
                text=str(ball.number),
                font=('Arial', 10, 'bold'),
                angle=angle
            )
        
        # Check ball-ball collisions
        for i in range(len(self.balls)):
            for j in range(i + 1, len(self.balls)):
                self.balls[i].collide_with_ball(self.balls[j])
        
        # Schedule next update
        self.last_time = self.root.after(16, self.update)  # ~60 FPS

if __name__ == '__main__':
    root = tk.Tk()
    root.title('Bouncing Balls in a Spinning Heptagon')
    simulator = HeptagonBounceSimulator(root)
    root.mainloop()
```

## :detective: Extra Findings & Tips

1. We find using lower KV cache quantization (4bit) seems to degrade generation quality via empirical tests - more tests need to be done, but we suggest using `q8_0` cache quantization. The goal of quantization is to support longer context lengths since the KV cache uses quite a bit of memory.
2. We found the `down_proj` in this model to be extremely sensitive to quantitation. We had to redo some of our dyanmic quants which used 2bits for `down_proj` and now we use 3bits as the minimum for all these matrices.
3. Using `llama.cpp` 's Flash Attention backend does result in somewhat faster decoding speeds. Use `-DGGML_CUDA_FA_ALL_QUANTS=ON` when compiling. Note it's also best to set your CUDA architecture as found in <https://developer.nvidia.com/cuda-gpus> to reduce compilation times, then set it via `-DCMAKE_CUDA_ARCHITECTURES="80"`
4. Using a `min_p=0.01`is probably enough. `llama.cpp`defaults to 0.1, which is probably not necessary. Since a temperature of 0.3 is used anyways, we most likely will very unlikely sample low probability tokens, so removing very unlikely tokens is a good idea. DeepSeek recommends 0.0 temperature for coding tasks.

[^1]: MUST USE 8bit - not 4bit

[^2]: CPU threads your machine has

[^3]: Approx 2 for 24GB GPU. Approx 18 for 80GB GPU.

---

## Connect to container

**URL:** llms-txt#connect-to-container

**Contents:**
  - **🔒 Security Notes**

ssh -i ~/.ssh/container_key -p 2222 unsloth@localhost
bash
-p <host_port>:<container_port>
bash
-v <local_folder>:<container_folder>
bash
docker run -d -e JUPYTER_PORT=8000 \
  -e JUPYTER_PASSWORD="mypassword" \
  -e "SSH_KEY=$(cat ~/.ssh/container_key.pub)" \
  -e USER_PASSWORD="unsloth2024" \
  -p 8000:8000 -p 2222:22 \
  -v $(pwd)/work:/workspace/work \
  --gpus all \
  unsloth/unsloth
```

### **🔒 Security Notes**

* Container runs as non-root `unsloth` user by default
* Use `USER_PASSWORD` for sudo operations inside container
* SSH access requires public key authentication

**Examples:**

Example 1 (unknown):
```unknown
| Variable           | Description                        | Default   |
| ------------------ | ---------------------------------- | --------- |
| `JUPYTER_PASSWORD` | Jupyter Lab password               | `unsloth` |
| `JUPYTER_PORT`     | Jupyter Lab port inside container  | `8888`    |
| `SSH_KEY`          | SSH public key for authentication  | `None`    |
| `USER_PASSWORD`    | Password for `unsloth` user (sudo) | `unsloth` |
```

Example 2 (unknown):
```unknown
* Jupyter Lab: `-p 8000:8888`
* SSH access: `-p 2222:22`

{% hint style="warning" %}
**Important**: Use volume mounts to preserve your work between container runs.
{% endhint %}
```

Example 3 (unknown):
```unknown

```

---

## Connect via SSH

**URL:** llms-txt#connect-via-ssh

**Contents:**
  - ⚙️ Advanced Settings
  - **🔒 Security Notes**

ssh -i ~/.ssh/container_key -p 2222 unsloth@localhost
bash
-p <host_port>:<container_port>
bash
-v <local_folder>:<container_folder>
bash
docker run -d -e JUPYTER_PORT=8000 \
  -e JUPYTER_PASSWORD="mypassword" \
  -e "SSH_KEY=$(cat ~/.ssh/container_key.pub)" \
  -e USER_PASSWORD="unsloth2024" \
  -p 8000:8000 -p 2222:22 \
  -v $(pwd)/work:/workspace/work \
  --gpus all \
  unsloth/unsloth
```

### **🔒 Security Notes**

* Container runs as non-root `unsloth` user by default
* Use `USER_PASSWORD` for sudo operations inside container
* SSH access requires public key authentication

**Examples:**

Example 1 (unknown):
```unknown
### ⚙️ Advanced Settings

| Variable           | Description                        | Default   |
| ------------------ | ---------------------------------- | --------- |
| `JUPYTER_PASSWORD` | Jupyter Lab password               | `unsloth` |
| `JUPYTER_PORT`     | Jupyter Lab port inside container  | `8888`    |
| `SSH_KEY`          | SSH public key for authentication  | `None`    |
| `USER_PASSWORD`    | Password for `unsloth` user (sudo) | `unsloth` |
```

Example 2 (unknown):
```unknown
* Jupyter Lab: `-p 8000:8888`
* SSH access: `-p 2222:22`

{% hint style="warning" %}
**Important**: Use volume mounts to preserve your work between container runs.
{% endhint %}
```

Example 3 (unknown):
```unknown

```

---

## Constants:

**URL:** llms-txt#constants:

WIDTH, HEIGHT =456 ,702   #
BACKGROUND_COLOR_LIGHTS=['lightskyblue']
GAP_SIZE=189           #

BIRD_RADIUS=3.  
PIPE_SPEED=- ( )    ? 
class Game():
def __init__(self):
        self.screen_size=( )

def reset_game_vars():
    global current_scor e
   # set to zero and other initial states.

---

## Constants

**URL:** llms-txt#constants

WIDTH, HEIGHT = 800, 600
GROUND_HEIGHT = 20
GRAVITY = 0.7
PIPE_SPEED = -3
BIRD_SIZE = 45
MIN_GAP = 130
MAX_GAP = 200
PIPE_COLORS = [(0, 96, 0), (205, 133, 63), (89, 97, 107)]
DARK_BROWN = (94, 72, 4)
YELLOW = (252, 228, 6)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

def random_light_color():
    return (
        random.randint(180, 230),
        random.randint(190, 300),
        random.randint(250, 255)
    )

def reset_game():
    global bird_x, bird_y
    global pipes, score
    global background_color, land_color
    global bird_shape, bird_color

# Bird properties
    bird_x = WIDTH * 0.3
    bird_y = HEIGHT // 2
    bird_vel = -5  # Initial upward thrust

pipes.clear() ### <<< NameError: name 'pipes' is not defined. Did you forget to import 'pipes'?
python
import pygame
from random import randint  # For generating colors/shapes/positions randomly 
pygame.init()

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

8. If you use `--repeat-penalty 1.5`, it gets even worse and more obvious, with actually totally incorrect syntax.
```

---

## Download the LLM example app directly

**URL:** llms-txt#download-the-llm-example-app-directly

**Contents:**
  - Deploying to Simulator

curl -L https://github.com/meta-pytorch/executorch-examples/archive/main.tar.gz | \
  tar -xz --strip-components=2 executorch-examples-main/llm/apple
bash

**Examples:**

Example 1 (unknown):
```unknown
{% columns %}
{% column %}
**Open in Xcode**

1. Open `apple/etLLM.xcodeproj` in Xcode
2. In the top toolbar, select `iPhone 16 Pro` Simulator as your target device
3. Hit Play (▶️) to build and run

🎉 Success! The app should now launch in the simulator. It won't work yet, we need to add your model.
{% endcolumn %}

{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FA4n2u44u9sLlauCkhf1b%2Funknown.png?alt=media&#x26;token=c93fef18-aab6-47cb-b301-d895466314f6" alt="" width="563"><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### Deploying to Simulator

&#x20;**No Developer Account is needed.**

**Prepare Your Model Files**

1. Stop the simulator in Xcode (press the stop button)
2. Navigate to your HuggingFace Hub repo (if not saved locally)
3. Download these two files:
   1. `qwen3_0.6B_model.pte` (your exported model)
   2. tokenizer.json (the tokenizer)

**Create a Shared Folder on the Simulator**

1. Click the virtual Home button on the simulator
2. Open the Files App → Browse → On My iPhone
3. Tap the ellipsis (•••) button and create a new folder named `Qwen3test`

**Transfer Files Using the Terminal**
```

---

## Float8

**URL:** llms-txt#float8

**Contents:**
  - :mobile\_phone:ExecuTorch - QAT for mobile deployment
  - :sunflower:How to enable QAT
  - :person\_tipping\_hand:Acknowledgements

from torchao.quantization import PerRow
from torchao.quantization import Float8DynamicActivationFloat8WeightConfig
torchao_config = Float8DynamicActivationFloat8WeightConfig(granularity = PerRow())
model.save_pretrained_torchao(torchao_config = torchao_config)
bash
pip install --upgrade --no-cache-dir --force-reinstall unsloth unsloth_zoo
pip install torchao==0.14.0 fbgemm-gpu-genai==1.3.0
```

### :person\_tipping\_hand:Acknowledgements

Huge thanks to the entire PyTorch and TorchAO team for their help and collaboration! Extreme thanks to Andrew Or, Jerry Zhang, Supriya Rao, Scott Roy and Mergen Nachin for helping on many discussions on QAT, and on helping to integrate it into Unsloth! Also thanks to the Executorch team as well!

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

### :mobile\_phone:ExecuTorch - QAT for mobile deployment

{% columns %}
{% column %}
With Unsloth and TorchAO’s QAT support, you can also fine-tune a model in Unsloth and seamlessly export it to [ExecuTorch](https://github.com/pytorch/executorch) (PyTorch’s solution for on-device inference) and deploy it directly on mobile. See an example in action [here](https://huggingface.co/metascroy/Qwen3-4B-int8-int4-unsloth) with more detailed workflows on the way!

**Announcement coming soon!**
{% endcolumn %}

{% column %}

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-53631bae5588644d2c64cec18f371f0a7e2688c6%2Fswiftpm_xcode.png?alt=media" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

### :sunflower:How to enable QAT

Update Unsloth to the latest version, and also install the latest TorchAO!

Then **try QAT with our free** [**Qwen3 (4B) notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)_Instruct-QAT.ipynb)

{% code overflow="wrap" %}
```

---

## Game constants

**URL:** llms-txt#game-constants

GRAVITY = 0.5
PIPE_SPEED = 5
BIRD_SIZE = 30
LAND_HEIGHT = 50
PIPE_WIDTH = 50
PIPE_GAP = 150

class Bird:
    def __init__(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.velocity = 0
        self.shape = random.choice(['square', 'circle', 'triangle'])
        self.color = (random.randint(0, 100), random.randint(0, 100), random.randint(0, 100))
        self.rect = pygame.Rect(self.x - BIRD_SIZE//2, self.y - BIRD_SIZE//2, BIRD_SIZE, BIRD_SIZE)
    
    def update(self):
        self.velocity += GRAVITY
        self.y += self.velocity
        self.rect.y = self.y - BIRD_SIZE//2
        self.rect.x = self.x - BIRD_SIZE//2  # Keep x centered
    
    def draw(self):
        if self.shape == 'square':
            pygame.draw.rect(screen, self.color, self.rect)
        elif self.shape == 'circle':
            pygame.draw.circle(screen, self.color, (self.rect.centerx, self.rect.centery), BIRD_SIZE//2)
        elif self.shape == 'triangle':
            points = [
                (self.rect.centerx, self.rect.top),
                (self.rect.left, self.rect.bottom),
                (self.rect.right, self.rect.bottom)
            ]
            pygame.draw.polygon(screen, self.color, points)

def spawn_pipe():
    pipe_x = WIDTH
    top_height = random.randint(50, HEIGHT - PIPE_GAP - LAND_HEIGHT)
    rect_top = pygame.Rect(pipe_x, 0, PIPE_WIDTH, top_height)
    bottom_y = top_height + PIPE_GAP
    bottom_height = (HEIGHT - LAND_HEIGHT) - bottom_y
    rect_bottom = pygame.Rect(pipe_x, bottom_y, PIPE_WIDTH, bottom_height)
    color = random.choice(pipe_colors)
    return {
        'rect_top': rect_top,
        'rect_bottom': rect_bottom,
        'color': color,
        'scored': False
    }

def main():
    best_score = 0
    current_score = 0
    game_over = False
    pipes = []
    first_time = True  # Track first game play

# Initial setup
    background_color = (173, 216, 230)  # Light blue initially
    land_color = random.choice(land_colors)
    bird = Bird()

while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE or event.key == pygame.K_q:
                    pygame.quit()
                    sys.exit()
                if event.key == pygame.K_SPACE:
                    if game_over:
                        # Reset the game
                        bird = Bird()
                        pipes.clear()
                        current_score = 0
                        if first_time:
                            # First restart after initial game over
                            background_color = (random.randint(200, 255), random.randint(200, 255), random.randint(200, 255))
                            first_time = False
                        else:
                            background_color = (random.randint(200, 255), random.randint(200, 255), random.randint(200, 255))
                        land_color = random.choice(land_colors)
                        game_over = False
                    else:
                        # Jump the bird
                        bird.velocity = -15  # Initial upward velocity

if not game_over:
            # Update bird and pipes
            bird.update()

# Move pipes left
            remove_pipes = []
            for pipe in pipes:
                pipe['rect_top'].x -= PIPE_SPEED
                pipe['rect_bottom'].x -= PIPE_SPEED
                # Check if bird passed the pipe
                if not pipe['scored'] and bird.rect.x > pipe['rect_top'].right:
                    current_score += 1
                    pipe['scored'] = True
                # Check if pipe is offscreen
                if pipe['rect_top'].right < 0:
                    remove_pipes.append(pipe)
            # Remove offscreen pipes
            for p in remove_pipes:
                pipes.remove(p)

# Spawn new pipe if needed
            if not pipes or pipes[-1]['rect_top'].x < WIDTH - 200:
                pipes.append(spawn_pipe())

# Check collisions
            land_rect = pygame.Rect(0, HEIGHT - LAND_HEIGHT, WIDTH, LAND_HEIGHT)
            bird_rect = bird.rect
            # Check pipes
            for pipe in pipes:
                if bird_rect.colliderect(pipe['rect_top']) or bird_rect.colliderect(pipe['rect_bottom']):
                    game_over = True
                    break
            # Check land and top
            if bird_rect.bottom >= land_rect.top or bird_rect.top <= 0:
                game_over = True

if game_over:
                if current_score > best_score:
                    best_score = current_score

# Drawing
        screen.fill(background_color)
        # Draw pipes
        for pipe in pipes:
            pygame.draw.rect(screen, pipe['color'], pipe['rect_top'])
            pygame.draw.rect(screen, pipe['color'], pipe['rect_bottom'])
        # Draw land
        pygame.draw.rect(screen, land_color, (0, HEIGHT - LAND_HEIGHT, WIDTH, LAND_HEIGHT))
        # Draw bird
        bird.draw()
        # Draw score
        font = pygame.font.SysFont(None, 36)
        score_text = font.render(f'Score: {current_score}', True, (0, 0, 0))
        screen.blit(score_text, (WIDTH - 150, 10))
        # Game over screen
        if game_over:
            over_text = font.render('Game Over!', True, (255, 0, 0))
            best_text = font.render(f'Best: {best_score}', True, (255, 0, 0))
            restart_text = font.render('Press SPACE to restart', True, (255, 0, 0))
            screen.blit(over_text, (WIDTH//2 - 70, HEIGHT//2 - 30))
            screen.blit(best_text, (WIDTH//2 - 50, HEIGHT//2 + 10))
            screen.blit(restart_text, (WIDTH//2 - 100, HEIGHT//2 + 50))
        
        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    main()
bash
./llama.cpp/llama-cli \
    --model unsloth-QwQ-32B-GGUF/QwQ-32B-Q4_K_M.gguf \
    --threads 32 \
    --ctx-size 16384 \
    --n-gpu-layers 99 \
    --seed 3407 \
    --prio 2 \
    --temp 0.6 \
    --repeat-penalty 1.1 \
    --dry-multiplier 0.5 \
    --min-p 0.01 \
    --top-k 40 \
    --top-p 0.95 \
    -no-cnv \
    --prompt "<|im_start|>user\nCreate a Flappy Bird game in Python. You must include these things:\n1. You must use pygame.\n2. The background color should be randomly chosen and is a light shade. Start with a light blue color.\n3. Pressing SPACE multiple times will accelerate the bird.\n4. The bird's shape should be randomly chosen as a square, circle or triangle. The color should be randomly chosen as a dark color.\n5. Place on the bottom some land colored as dark brown or yellow chosen randomly.\n6. Make a score shown on the top right side. Increment if you pass pipes and don't hit them.\n7. Make randomly spaced pipes with enough space. Color them randomly as dark green or light brown or a dark gray shade.\n8. When you lose, show the best score. Make the text inside the screen. Pressing q or Esc will quit the game. Restarting is pressing SPACE again.\nThe final game should be inside a markdown section in Python. Check your code for errors and fix them before the final markdown section.<|im_end|>\n<|im_start|>assistant\n<think>\n"  \
        2>&1 | tee Q4_K_M_no_samplers.txt
python
import pygame
import random

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

</details>

6. When running it, we get a runnable game!

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1740ecd246c7f62c363bc0ba1e0f1099b2f9b2a4%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

7. Now try the same without our fixes! So remove `--samplers "top_k;top_p;min_p;temperature;dry;typ_p;xtc"` This will save the output to `Q4_K_M_no_samplers.txt`
```

Example 2 (unknown):
```unknown
You will get some looping, but **problematically incorrect Python syntax** and many other issues. For example the below looks correct, but is wrong! Ie line 39 `pipes.clear() ### <<< NameError: name 'pipes' is not defined. Did you forget to import 'pipes'?`

{% code overflow="wrap" lineNumbers="true" %}
```

---

## Google Colab

**URL:** llms-txt#google-colab

**Contents:**
  - Colab Example Code

To install and run Unsloth on Google Colab, follow the steps below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-4d1b1778f3c8bde62a40130d7b4395b8bb1ce90f%2FColab%20Options.png?alt=media" alt=""><figcaption></figcaption></figure>

If you have never used a Colab notebook, a quick primer on the notebook itself:

1. **Play Button at each "cell".** Click on this to run that cell's code. You must not skip any cells and you must run every cell in chronological order. If you encounter errors, simply rerun the cell you did not run. Another option is to click CTRL + ENTER if you don't want to click the play button.
2. **Runtime Button in the top toolbar.** You can also use this button and hit "Run all" to run the entire notebook in 1 go. This will skip all the customization steps, but is a good first try.
3. **Connect / Reconnect T4 button.** T4 is the free GPU Google is providing. It's quite powerful!

The first installation cell looks like below: Remember to click the PLAY button in the brackets \[ ]. We grab our open source Github package, and install some other packages.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-135cd796b01420cc4d5ce3ca243e9065154070a5%2Fimage%20(13)%20(1)%20(1).png?alt=media" alt=""><figcaption></figcaption></figure>

### Colab Example Code

Unsloth example code to fine-tune gpt-oss-20b:

```python
from unsloth import FastLanguageModel, FastModel
import torch
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset
max_seq_length = 2048 # Supports RoPE Scaling internally, so choose any!

---

## Go to https://docs.unsloth.ai for advanced tips like

**URL:** llms-txt#go-to-https://docs.unsloth.ai-for-advanced-tips-like

---

## GSPO Reinforcement Learning

**URL:** llms-txt#gspo-reinforcement-learning

Train with GSPO (Group Sequence Policy Optimization) RL in Unsloth.

We're introducing GSPO which is a variant of [GRPO](https://docs.unsloth.ai/get-started/reinforcement-learning-rl-guide/..#from-rlhf-ppo-to-grpo-and-rlvr) made by the Qwen team at Alibaba. They noticed the observation that when GRPO takes importance weights for each token, even though inherently advantages do not scale or change with each token. This lead to the creation of GSPO, which now assigns the importance on the sequence likelihood rather than the individual token likelihoods of the tokens.

* Use our free GSPO notebooks for: [**gpt-oss-20b**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) and [**Qwen2.5-VL**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen2_5_7B_VL_GRPO.ipynb)

Enable GSPO in Unsloth by setting `importance_sampling_level = "sequence"` in the GRPO config. The difference between these two algorithms can be seen below, both from the GSPO paper from Qwen and Alibaba:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-45d743dd5dcd590626777ce09cfab61808aa8c24%2Fimage.png?alt=media" alt="" width="563"><figcaption><p>GRPO Algorithm, Source: <a href="https://arxiv.org/abs/2507.18071">Qwen</a></p></figcaption></figure>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-ee755850cbe17482ce240dde227d55c62e9a3e64%2Fimage.png?alt=media" alt="" width="563"><figcaption><p>GSPO algorithm, Source: <a href="https://arxiv.org/abs/2507.18071">Qwen</a></p></figcaption></figure>

In Equation 1, it can be seen that the advantages scale each of the rows into the token logprobs before that tensor is sumed. Essentially, each token is given the same scaling even though that scaling was given to the entire sequence rather than each individual token. A simple diagram of this can be seen below:

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b3c944808a15dde0a7ff45782f9f074993304bf1%2FCopy%20of%20GSPO%20diagram%20(1).jpg?alt=media" alt="" width="286"><figcaption><p>GRPO Logprob Ratio row wise scaled with advantages</p></figcaption></figure>

Equation 2 shows that the logprob ratios for each sequence is summed and exponentiated after the Logprob ratios are computed, and only the resulting now sequence ratios get row wise multiplied by the advantages.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-62fc5b50921e79cce155d2794201c9b96faf941e%2FGSPO%20diagram%20(1).jpg?alt=media" alt="" width="313"><figcaption><p>GSPO Sequence Ratio row wise scaled with advantages</p></figcaption></figure>

Enabling GSPO is simple, all you need to do is set the `importance_sampling_level = "sequence"` flag in the GRPO config.

**Examples:**

Example 1 (python):
```python
training_args = GRPOConfig(
    output_dir = "vlm-grpo-unsloth",
    per_device_train_batch_size = 8,
    gradient_accumulation_steps = 4,
    learning_rate = 5e-6,
    adam_beta1 = 0.9,
    adam_beta2 = 0.99,
    weight_decay = 0.1,
    warmup_ratio = 0.1,
    lr_scheduler_type = "cosine",
    optim = "adamw_8bit",
    # beta = 0.00,
    epsilon = 3e-4,
    epsilon_high = 4e-4,
    num_generations = 8,    
    max_prompt_length = 1024,
    max_completion_length = 1024,
    log_completions = False,
    max_grad_norm = 0.1,
    temperature = 0.9,
    # report_to = "none", # Set to "wandb" if you want to log to Weights & Biases
    num_train_epochs = 2, # For a quick test run, increase for full training
    report_to = "none"
    
    # GSPO is below:
    importance_sampling_level = "sequence",
    
    # Dr GRPO / GAPO etc
    loss_type = "dr_grpo",
)
```

---

## Important: Reorganize to satisfy SDK structure

**URL:** llms-txt#important:-reorganize-to-satisfy-sdk-structure

**Contents:**
  - Step 2: Configure Environment Variables
  - Step 3: Install SDK Components

mv cmdline-tools/cmdline-tools cmdline-tools/latest
bash
export ANDROID_HOME=$HOME/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
bash
source ~/.zshrc  # or ~/.bashrc depending on your shell
bash

**Examples:**

Example 1 (unknown):
```unknown
### Step 2: Configure Environment Variables

Add these to your `~/.bashrc` or `~/.zshrc`:
```

Example 2 (unknown):
```unknown
Reload them:
```

Example 3 (unknown):
```unknown
### Step 3: Install SDK Components

ExecuTorch requires specific NDK versions.
```

---

## Int4 QAT

**URL:** llms-txt#int4-qat

from torchao.quantization import Int4WeightOnlyConfig
model.save_pretrained_torchao(
    model, "tokenizer",
    torchao_config = Int4WeightOnlyConfig(),
)

---

## Int8 QAT

**URL:** llms-txt#int8-qat

**Contents:**
  - :teapot:Quantizing models without training

from torchao.quantization import Int8DynamicActivationInt8WeightConfig
model.save_pretrained_torchao(
    model, "tokenizer",
    torchao_config = Int8DynamicActivationInt8WeightConfig(),
)
python

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

You can then run the merged QAT lower precision model in vLLM, Unsloth and other systems for inference! These are all in the [Qwen3-4B QAT Colab notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_\(4B\)_Instruct-QAT.ipynb) we have as well!

### :teapot:Quantizing models without training

You can also call `model.save_pretrained_torchao` directly without doing any QAT as well! This is simply PTQ or native quantization. For example, saving to Dynamic float8 format is below:

{% code overflow="wrap" %}
```

---

## Launch the shell

**URL:** llms-txt#launch-the-shell

**Contents:**
  - Unified Memory Usage
  - Video Tutorials

CMD ["/bin/bash"]
bash
docker run -it \
    --gpus=all \
    --net=host \
    --ipc=host \
    --ulimit memlock=-1 \
    --ulimit stack=67108864 \
    -v $(pwd):$(pwd) \
    -v $HOME/.cache/huggingface:/root/.cache/huggingface \
    -w $(pwd) \
    unsloth-dgx-spark
bash
NOTEBOOK_URL="https://raw.githubusercontent.com/unslothai/notebooks/refs/heads/main/nb/gpt_oss_(20B)_Reinforcement_Learning_2048_Game_DGX_Spark.ipynb"
wget -O "gpt_oss_20B_RL_2048_Game.ipynb" "$NOTEBOOK_URL"

jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root
```

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-0862eed0acf0656ff0cb802b6aebc30892997e3b%2Fdgx6.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

Don't forget Unsloth also allows you to [save and run](https://docs.unsloth.ai/basics/inference-and-deployment) your models after fine-tuning so you can locally deploy them directly on your DGX Spark after.
{% endstep %}
{% endstepper %}

Many thanks to [Lakshmi Ramesh](https://www.linkedin.com/in/rlakshmi24/) and [Barath Anandan](https://www.linkedin.com/in/barathsa/) from NVIDIA for helping Unsloth’s DGX Spark launch and building the Docker image.

### Unified Memory Usage

gpt-oss-120b QLoRA 4-bit fine-tuning will use around **68GB** of unified memory. How your unified memory usage should look **before** (left) and **after** (right) training:

<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-e079a9aa8d853b319520fe0f0fbcca2e85b31ea6%2Fdgx7.png?alt=media" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-c389a73a48ad059bbb92121b328fa7ccc61bee95%2Fdgx8.png?alt=media" alt=""><figcaption></figcaption></figure></div>

And that's it! Have fun training and running LLMs completely locally on your NVIDIA DGX Spark!

Thanks to Tim from [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) for providing a great fine-tuning tutorial with Unsloth on DGX Spark:

{% embed url="<https://www.youtube.com/watch?t=962s&v=zs-J9sKxvoM>" %}

**Examples:**

Example 1 (unknown):
```unknown
</details>
{% endstep %}

{% step %}
**Launch container**

Launch the training container with GPU access and volume mounts:
```

Example 2 (unknown):
```unknown
<div><figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a67c36494f5c4ab4017748d490fb258655cd2378%2Fdgx2.png?alt=media" alt=""><figcaption></figcaption></figure> <figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-b7758db087ab8b724049361781952b5ed154dfe8%2Fdgx5.png?alt=media" alt=""><figcaption></figcaption></figure></div>
{% endstep %}

{% step %}
**Start Jupyter and Run Notebooks**

Inside the container, start Jupyter and run the required notebook. You can use the Reinforcement Learning gpt-oss 20b to win 2048 [notebook here](https://github.com/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_Reinforcement_Learning_2048_Game_DGX_Spark.ipynb). In fact all [Unsloth notebooks](https://docs.unsloth.ai/get-started/unsloth-notebooks) work in DGX Spark including the **120b** notebook! Just remove the installation cells.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-a8472482c49e1763378b609f8f537ca89df60260%2FNotebooks%20on%20dgx.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

The below commands can be used to run the RL notebook as well. After Jupyter Notebook is launched, open up the “`gpt_oss_20B_RL_2048_Game.ipynb`”
```

---

## Licensed under the Apache License, Version 2.0 (the "License")

**URL:** llms-txt#licensed-under-the-apache-license,-version-2.0-(the-"license")

try: import torch
except: raise ImportError('Install torch via `pip install torch`')
from packaging.version import Version as V
import re
v = V(re.match(r"[0-9\.]{3,}", torch.__version__).group(0))
cuda = str(torch.version.cuda)
is_ampere = torch.cuda.get_device_capability()[0] >= 8
USE_ABI = torch._C._GLIBCXX_USE_CXX11_ABI
if cuda not in ("11.8", "12.1", "12.4", "12.6", "12.8", "13.0"): raise RuntimeError(f"CUDA = {cuda} not supported!")
if   v <= V('2.1.0'): raise RuntimeError(f"Torch = {v} too old!")
elif v <= V('2.1.1'): x = 'cu{}{}-torch211'
elif v <= V('2.1.2'): x = 'cu{}{}-torch212'
elif v  < V('2.3.0'): x = 'cu{}{}-torch220'
elif v  < V('2.4.0'): x = 'cu{}{}-torch230'
elif v  < V('2.5.0'): x = 'cu{}{}-torch240'
elif v  < V('2.5.1'): x = 'cu{}{}-torch250'
elif v <= V('2.5.1'): x = 'cu{}{}-torch251'
elif v  < V('2.7.0'): x = 'cu{}{}-torch260'
elif v  < V('2.7.9'): x = 'cu{}{}-torch270'
elif v  < V('2.8.0'): x = 'cu{}{}-torch271'
elif v  < V('2.8.9'): x = 'cu{}{}-torch280'
elif v  < V('2.9.1'): x = 'cu{}{}-torch290'
elif v  < V('2.9.2'): x = 'cu{}{}-torch291'
else: raise RuntimeError(f"Torch = {v} too new!")
if v > V('2.6.9') and cuda not in ("11.8", "12.6", "12.8", "13.0"): raise RuntimeError(f"CUDA = {cuda} not supported!")
x = x.format(cuda.replace(".", ""), "-ampere" if False else "") # is_ampere is broken due to flash-attn
print(f'pip install --upgrade pip && pip install --no-deps git+https://github.com/unslothai/unsloth-zoo.git && pip install "unsloth[{x}] @ git+https://github.com/unslothai/unsloth.git" --no-build-isolation')
```

---

## MULTI-MODAL INSTRUCTIONS

**URL:** llms-txt#multi-modal-instructions

You have the ability to read images, but you cannot generate images. You also cannot transcribe audio files or videos.
You cannot read nor transcribe audio files or videos.

---

## optional; experiment with these:

**URL:** llms-txt#optional;-experiment-with-these:

---

## OPTIONAL use a virtual environment

**URL:** llms-txt#optional-use-a-virtual-environment

python -m venv unsloth_env
source unsloth_env/bin/activate

---

## Original Unsloth version released April 2024 - LGPLv3 Licensed

**URL:** llms-txt#original-unsloth-version-released-april-2024---lgplv3-licensed

**Contents:**
  - 🔓 Tiled MLP: Unlocking 500K+

class Unsloth_Offloaded_Gradient_Checkpointer(torch.autograd.Function):
    @staticmethod
    @torch_amp_custom_fwd
    def forward(ctx, forward_function, hidden_states, *args):
        ctx.device = hidden_states.device
        saved_hidden_states = hidden_states.to("cpu", non_blocking = True)
        with torch.no_grad():
            output = forward_function(hidden_states, *args)
        ctx.save_for_backward(saved_hidden_states)
        ctx.forward_function, ctx.args = forward_function, args
        return output

@staticmethod
    @torch_amp_custom_bwd
    def backward(ctx, dY):
        (hidden_states,) = ctx.saved_tensors
        hidden_states = hidden_states.to(ctx.device, non_blocking = True).detach()
        hidden_states.requires_grad_(True)
        with torch.enable_grad():
            (output,) = ctx.forward_function(hidden_states, *ctx.args)
        torch.autograd.backward(output, dY)
        return (None, hidden_states.grad,) + (None,)*len(ctx.args)
py
model, tokenizer = FastLanguageModel.from_pretrained(
    ...,
    unsloth_tiled_mlp = True,
)
```

Just set `unsloth_tiled_mlp = True` in `from_pretrained` and Tiled MLP is enabled. We follow the same logic as the Arctic paper and choose `num_shards = ceil(seq_len/hidden_size)`. Each tile will operate on sequence lengths which are the same size of the hidden dimension of the model to balance throughput and memory savings.

We also discussed how Tiled MLP effectively does 3 forward passes and 1 backward, compared to normal gradient checkpointing which does 2 forward passes and 1 backward with Stas Bekman and [DeepSpeed](https://github.com/deepspeedai/DeepSpeed/pull/7664) provided a doc update for Tiled MLP within DeepSpeed.

{% hint style="success" %}
Next time fine-tuning runs out of memory, try turning on `unsloth_tiled_mlp = True`. This should save some VRAM as long as the context length is longer than the LLM's hidden dimension.
{% endhint %}

**With our latest update, it is possible to now reach 1M context length with a smaller model on a single GPU!**

**Try 500K-context gpt-oss-20b fine-tuning on our** [**80GB A100 Colab notebook**](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt_oss_\(20B\)_500K_Context_Fine_tuning.ipynb)**.**

If you've made it this far, we're releasing a new blog on our latest improvements in training speed this week so stay tuned by joining our [Reddit r/unsloth](https://www.reddit.com/r/unsloth/) or our Docs.

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

By offloading activations as soon as they are produced, we minimize peak activation footprint and free GPU memory exactly when it’s needed. This sharply reduces memory pressure in long-context or large-batch training, where a single decoder layer’s activations can exceed 2 GB.

> **Thus, Unsloth’s new algorithms & Gradient Checkpointing contributes to most improvements (3.2x), enabling 290k-context-length QLoRA GPT-OSS fine-tuning on a single H100.**

### 🔓 Tiled MLP: Unlocking 500K+

With help from [Stas Bekman](https://x.com/StasBekman) (Snowflake), we integrated Tiled MLP from Snowflake’s Arctic Long Sequence Training [paper](https://arxiv.org/abs/2506.13996) and blog post. TiledMLP reduces activation memory and enables much longer sequence lengths by tiling hidden states along the sequence dimension before heavy MLP projections.

**We also introduce a few quality-of-life improvements:**

We preserve RNG state across tiled forward recomputations so dropout and other stochastic ops are consistent between forward and backward replays. This keeps nested checkpointed computations stable and numerically identical.

{% hint style="success" %}
Our implementation auto patches any module named or typed as `mlp`, so **nearly all models with MLP modules are supported out of the box for Tiled MLP.**
{% endhint %}

**Tradeoffs to keep in mind**

TiledMLP saves VRAM at the cost of extra forward passes. Because it lives inside a checkpointed transformer block and is itself written in a checkpoint style, it effectively becomes a nested checkpoint: one **MLP now performs \~3 forward passes and 1 backward pass per step**. In return, we can drop almost all intermediate MLP activations from VRAM while still supporting extremely long sequences.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FdeOJEEqucGYtbXbb7nqB%2Fbaseline_vs_unsloth_spike.png?alt=media&#x26;token=3b1cdfd3-dd24-4c94-b7ec-5d1366464afb" alt=""><figcaption></figcaption></figure>

The plots compare active memory timelines for a single decoder layer’s forward and backward during a long-context training step, without Tiled MLP (left) and with it (right). Without Tiled MLP, peak VRAM occurs during the MLP backward; with Tiled MLP, it shifts to the fused loss calculation. We see \~40% lower VRAM usage, and because the fused loss auto chunks dynamically based on available VRAM, the peak with Tiled MLP would be even smaller on smaller GPUs.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2FUCx0X7S5FvaD3hUsma5j%2Fbaseline_vs_unsloth_nospike.png?alt=media&#x26;token=a81b8639-21d0-43aa-a837-8209949e8742" alt=""><figcaption></figcaption></figure>

To show cross-entropy loss is not the new bottleneck, we fix its chunk size instead of choosing it dynamically and then double the number of chunks. This significantly reduces the loss-related memory spikes. The max memory now occurs during backward in both cases, and overall timing is similar, though Tiled MLP adds a small overhead: one large GEMM becomes many sequential matmuls, plus the extra forward pass mentioned above.

Overall, the trade-off is worth it: without Tiled MLP, long-context training can require roughly 2× the memory usage, while with **Tiled MLP a single GPU pays only about a 1.3× increase in step time for the same context length.**

**Enabling Tiled MLP in Unsloth:**
```

---

## or:

**URL:** llms-txt#or:

mask_truncated_completions=True,
python

**Examples:**

Example 1 (unknown):
```unknown
{% endhint %}

You should see the reward increase overtime. We would recommend you train for at least 300 steps which may take 30 mins however, for optimal results, you should train for longer.

{% hint style="warning" %}
If you're having issues with your GRPO model not learning, we'd highly recommend to use our [Advanced GRPO notebooks](https://docs.unsloth.ai/unsloth-notebooks#grpo-reasoning-notebooks) as it has a much better reward function and you should see results much faster and frequently.
{% endhint %}

You will also see sample answers which allows you to see how the model is learning. Some may have steps, XML tags, attempts etc. and the idea is as trains it's going to get better and better because it's going to get scored higher and higher until we get the outputs we desire with long reasoning chains of answers.

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-f33d6f494605ab9ca69a0b697ed5865dd3a30b18%2Fimage.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>
{% endstep %}

{% step %}

#### Run & Evaluate your model

Run your model by clicking the play button. In the first example, there is usually no reasoning in the answer and in order to see the reasoning, we need to first save the LoRA weights we just trained with GRPO first using:

<pre><code><strong>model.save_lora("grpo_saved_lora")
</strong></code></pre>

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-1ab351622655983aeda4d9d6d217cf354cb280be%2Fimage%20(10)%20(1)%20(1).png?alt=media" alt=""><figcaption><p>The first inference example run has no reasoning. You must load the LoRA and test it to reveal the reasoning.</p></figcaption></figure>

Then we load the LoRA and test it. Our reasoning model is much better - it's not always correct, since we only trained it for an hour or so - it'll be better if we extend the sequence length and train for longer!

You can then save your model to GGUF, Ollama etc. by following our [guide here](https://docs.unsloth.ai/fine-tuning-llms-guide#id-7.-running--saving-the-model).

<figure><img src="https://3215535692-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxhOjnexMCB3dmuQFQ2Zq%2Fuploads%2Fgit-blob-38fa0c97184487aaa6b259f5b23b7f27345871d8%2Fimage.png?alt=media" alt=""><figcaption></figcaption></figure>

If you are still not getting any reasoning, you may have either trained for too less steps or your reward function/verifier was not optimal.
{% endstep %}

{% step %}

#### Save your model

We have multiple options for saving your fine-tuned model, but we’ll focus on the easiest and most popular approaches which you can read more about [here](https://docs.unsloth.ai/basics/inference-and-deployment)

**Saving in 16-bit Precision**

You can save the model with 16-bit precision using the following command:
```

---

## Output should look like: openjdk version "17.0.x"

**URL:** llms-txt#output-should-look-like:-openjdk-version-"17.0.x"

**Contents:**
  - Step 1: Install Android SDK & NDK

java -version
bash
sudo apt install openjdk-17-jdk
bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
bash
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk
bash
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-*.zip -d cmdline-tools

**Examples:**

Example 1 (unknown):
```unknown
If it does not match, install it via Ubuntu/Debian:
```

Example 2 (unknown):
```unknown
Then set it as default or export `JAVA_HOME`:
```

Example 3 (unknown):
```unknown
If you are on a different OS or distribution, you might want to follow [this guide](https://docs.oracle.com/en/java/javase/25/install/overview-jdk-installation.html) or just ask your favorite LLM to guide you through.

### Step 1: Install Android SDK & NDK

Set up a minimal Android SDK environment without the full Android Studio.

1\. Create the SDK directory:
```

Example 4 (unknown):
```unknown
2. Install Android Command Line Tools
```

---

## Reinforcement Learning - DPO, ORPO & KTO

**URL:** llms-txt#reinforcement-learning---dpo,-orpo-&-kto

**Contents:**
- DPO Code

To use the reward modelling functions for DPO, GRPO, ORPO or KTO with Unsloth, follow the steps below:

DPO (Direct Preference Optimization), ORPO (Odds Ratio Preference Optimization), PPO, KTO Reward Modelling all work with Unsloth.

We have Google Colab notebooks for reproducing GRPO, ORPO, DPO Zephyr, KTO and SimPO:

* [GRPO notebooks](https://docs.unsloth.ai/unsloth-notebooks#grpo-reasoning-rl-notebooks)
* [ORPO notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3_\(8B\)-ORPO.ipynb)
* [DPO Zephyr notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Zephyr_\(7B\)-DPO.ipynb)
* [KTO notebook](https://colab.research.google.com/drive/1MRgGtLWuZX4ypSfGguFgC-IblTvO2ivM?usp=sharing)
* [SimPO notebook](https://colab.research.google.com/drive/1Hs5oQDovOay4mFA6Y9lQhVJ8TnbFLFh2?usp=sharing)

We're also in 🤗Hugging Face's official docs! We're on the [SFT docs](https://huggingface.co/docs/trl/main/en/sft_trainer#accelerate-fine-tuning-2x-using-unsloth) and the [DPO docs](https://huggingface.co/docs/trl/main/en/dpo_trainer#accelerate-dpo-fine-tuning-using-unsloth).

```python
python
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "0" # Optional set GPU device ID

from unsloth import FastLanguageModel, PatchDPOTrainer
from unsloth import is_bfloat16_supported
PatchDPOTrainer()
import torch
from transformers import TrainingArguments
from trl import DPOTrainer

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/zephyr-sft-bnb-4bit",
    max_seq_length = max_seq_length,
    dtype = None,
    load_in_4bit = True,
)

---

## required:

**URL:** llms-txt#required:

---

## RL Reward Hacking

**URL:** llms-txt#rl-reward-hacking

**Contents:**
- :trophy: Reward Hacking Overview

Learn what is Reward Hacking in Reinforcement Learning and how to counter it.

The ultimate goal of RL is to maximize some reward (say speed, revenue, some metric). But RL can **cheat.** When the RL algorithm learns a trick or exploits something to increase the reward, without actually doing the task at end, this is called "**Reward Hacking**".

It's the reason models learn to modify unit tests to pass coding challenges, and these are critical blockers for real world deployment. Some other good examples are from [Wikipedia](https://en.wikipedia.org/wiki/Reward_hacking).

<div align="center"><figure><img src="https://i.pinimg.com/originals/55/e0/1b/55e01b94a9c5546b61b59ae300811c83.gif" alt="" width="188"><figcaption></figcaption></figure></div>

**Can you counter reward hacking? Yes!** In our [free gpt-oss RL notebook](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-\(20B\)-GRPO.ipynb) we explore how to counter reward hacking in a code generation setting and showcase tangible solutions to common error modes. We saw the model edit the timing function, outsource to other libraries, cache the results, and outright cheat. After countering, the result is our model generates genuinely optimized matrix multiplication kernels, not clever cheats.

## :trophy: Reward Hacking Overview

Some common examples of reward hacking during RL include:

RL learns to use Numpy, Torch, other libraries, which calls optimized CUDA kernels. We can stop the RL algorithm from calling optimized code by inspecting if the generated code imports other non standard Python libraries.

#### Caching & Cheating

RL learns to cache the result of the output and RL learns to find the actual output by inspecting Python global variables.

We can stop the RL algorithm from using cached data by wiping the cache with a large fake matrix. We also have to benchmark carefully with multiple loops and turns.

RL learns to edit the timing function to make it output 0 time as passed. We can stop the RL algorithm from using global or cached variables by restricting it's `locals` and `globals`. We are also going to use `exec` to create the function, so we have to save the output to an empty dict. We also disallow global variable access via `types.FunctionType(f.__code__, {})`\\

---

## Set CUDA environment variables

**URL:** llms-txt#set-cuda-environment-variables

ENV CUDA_HOME=/usr/local/cuda-13.0/
ENV CUDA_PATH=$CUDA_HOME
ENV PATH=$CUDA_HOME/bin:$PATH
ENV LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
ENV C_INCLUDE_PATH=$CUDA_HOME/include:$C_INCLUDE_PATH
ENV CPLUS_INCLUDE_PATH=$CUDA_HOME/include:$CPLUS_INCLUDE_PATH

---

## TOOL CALLING INSTRUCTIONS

**URL:** llms-txt#tool-calling-instructions

**Contents:**
- 📖 Run Ministral 3 Tutorials
  - Instruct: Ministral-3-Instruct-2512

You may have access to tools that you can use to fetch information or perform actions. You must use these tools in the following situations:

1. When the request requires up-to-date information.
2. When the request requires specific data that you do not have in your knowledge base.
3. When the request involves actions that you cannot perform without tools.

Always prioritize using tools to provide the most accurate and helpful response. If tools are not available, inform the user that you cannot perform the requested action at the moment.[/SYSTEM_PROMPT][INST]What is 1+1?[/INST]2</s>[INST]What is 2+2?[/INST]
bash
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev -y
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build \
    -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON -DLLAMA_CURL=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-mtmd-cli llama-server llama-gguf-split
cp llama.cpp/build/bin/llama-* llama.cpp
bash
./llama.cpp/llama-cli \
    -hf unsloth/Ministral-3-14B-Instruct-2512-GGUF:Q4_K_XL \
    --jinja -ngl 99 --threads -1 --ctx-size 32684 \
    --temp 0.15
python

**Examples:**

Example 1 (unknown):
```unknown
{% endcode %}

## 📖 Run Ministral 3 Tutorials

Below are guides for the [Reasoning](#reasoning-ministral-3-reasoning-2512) and [Instruct](#instruct-ministral-3-instruct-2512) variants of the model.

### Instruct: Ministral-3-Instruct-2512

To achieve optimal performance for **Instruct**, Mistral recommends using lower temperatures such as `temperature = 0.15` or `0.1`

#### :sparkles: Llama.cpp: Run Ministral-3-14B-Instruct Tutorial

{% stepper %}
{% step %}
Obtain the latest `llama.cpp` on [GitHub here](https://github.com/ggml-org/llama.cpp). You can follow the build instructions below as well. Change `-DGGML_CUDA=ON` to `-DGGML_CUDA=OFF` if you don't have a GPU or just want CPU inference.

{% code overflow="wrap" %}
```

Example 2 (unknown):
```unknown
{% endcode %}
{% endstep %}

{% step %}
You can directly pull from Hugging Face via:
```

Example 3 (unknown):
```unknown
{% endstep %}

{% step %}
Download the model via (after installing `pip install huggingface_hub hf_transfer` ). You can choose `UD_Q4_K_XL` or other quantized versions.
```

---

## Unsloth Environment Flags

**URL:** llms-txt#unsloth-environment-flags

Advanced flags which might be useful if you see breaking finetunes, or you want to turn stuff off.

<table><thead><tr><th width="397.4666748046875">Environment variable</th><th>Purpose</th><th data-hidden></th></tr></thead><tbody><tr><td><code>os.environ["UNSLOTH_RETURN_LOGITS"] = "1"</code></td><td>Forcibly returns logits - useful for evaluation if logits are needed.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_COMPILE_DISABLE"] = "1"</code></td><td>Disables auto compiler. Could be useful to debug incorrect finetune results.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_DISABLE_FAST_GENERATION"] = "1"</code></td><td>Disables fast generation for generic models.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_ENABLE_LOGGING"] = "1"</code></td><td>Enables auto compiler logging - useful to see which functions are compiled or not.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_FORCE_FLOAT32"] = "1"</code></td><td>On float16 machines, use float32 and not float16 mixed precision. Useful for Gemma 3.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_STUDIO_DISABLED"] = "1"</code></td><td>Disables extra features.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_COMPILE_DEBUG"] = "1"</code></td><td>Turns on extremely verbose <code>torch.compile</code>logs.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_COMPILE_MAXIMUM"] = "0"</code></td><td>Enables maximum <code>torch.compile</code>optimizations - not recommended.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_COMPILE_IGNORE_ERRORS"] = "1"</code></td><td>Can turn this off to enable fullgraph parsing.</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_FULLGRAPH"] = "0"</code></td><td>Enable <code>torch.compile</code> fullgraph mode</td><td></td></tr><tr><td><code>os.environ["UNSLOTH_DISABLE_AUTO_UPDATES"] = "1"</code></td><td>Forces no updates to <code>unsloth-zoo</code></td><td></td></tr></tbody></table>

Another possiblity is maybe the model uploads we uploaded are corrupted, but unlikely. Try the following:

**Examples:**

Example 1 (python):
```python
model, tokenizer = FastVisionModel.from_pretrained(
    "Qwen/Qwen2-VL-7B-Instruct",
    use_exact_model_name = True,
)
```

---

## Updating

**URL:** llms-txt#updating

**Contents:**
- Standard Updating (recommended):
  - Updating without dependency updates:
- To use an old version of Unsloth:

To update or use an old version of Unsloth, follow the steps below:

## Standard Updating (recommended):

### Updating without dependency updates:

<pre class="language-bash" data-overflow="wrap"><code class="lang-bash">pip install --upgrade --force-reinstall --no-cache-dir --no-deps unsloth
<strong>pip install --upgrade --force-reinstall --no-cache-dir --no-deps unsloth_zoo
</strong></code></pre>

## To use an old version of Unsloth:

{% code overflow="wrap" %}

'2025.1.5' is one of the previous old versions of Unsloth. Change it to a specific release listed on our [Github here](https://github.com/unslothai/unsloth/releases).

**Examples:**

Example 1 (bash):
```bash
pip install --upgrade unsloth unsloth_zoo
```

Example 2 (bash):
```bash
pip install --force-reinstall --no-cache-dir --no-deps unsloth==2025.1.5
```

---

## Use the exact same config as QAT (convenient function)

**URL:** llms-txt#use-the-exact-same-config-as-qat-(convenient-function)

model.save_pretrained_torchao(
    model, "tokenizer", 
    torchao_config = model._torchao_config.base_config,
)

---

## WEB BROWSING INSTRUCTIONS

**URL:** llms-txt#web-browsing-instructions

You cannot perform any web search or access internet to open URLs, links etc. If it seems like the user is expecting you to do so, you clarify the situation and ask the user to copy paste the text directly in the chat.

---
