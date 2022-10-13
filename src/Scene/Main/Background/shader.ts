const fragShader = `
#define SHADER_NAME BEND_WAVES_FS

precision mediump float;

uniform float     uTime;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main( void )
{
    vec2 uv = outTexCoord;
    //uv.y *= -1.0;
    uv.y += (sin((uv.x + (uTime * 0.5)) * 10.0) * 0.001) + (sin((uv.x + (uTime * 0.1)) * 32.0) * 0.001);
    uv.x -= (sin((uv.x + (uTime * 0.5)) * 10.0) * 0.003) + (sin((uv.x + (uTime * 0.1)) * 50.0) * 0.009);
    vec4 texColor = texture2D(uMainSampler, uv);
    gl_FragColor = texColor;
}
`;

export default class BendWaves extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  private time: number;

  constructor(game: Phaser.Game) {
    super({
      game,
      renderTarget: true,
      fragShader,
      uniforms: [
        'uProjectionMatrix',
        'uMainSampler',
        'uTime',
      ]
    });
    this.time = 0;
  }

  onPreRender(): void {
    this.time += 0.02;
    this.set1f('uTime', this.time);
  }
}
