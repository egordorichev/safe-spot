#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D tex0;


void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  
  vec4 color = texture2D(tex0, uv);
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

  float dx = 0.5 - uv.x;
  float dy = 0.5 - uv.y;
  float d = sqrt(dx * dx + dy * dy);
  float v = max(0.0, 1.0 - d * 4.0);

	gl_FragColor = vec4(color.r * v + gray * (1.0 - v), color.g * v + gray * (1.0 - v), color.b * v + gray * (1.0 - v), 1.0);
}